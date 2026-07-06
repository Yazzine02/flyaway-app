import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/auth.service';
import { FlightService } from '../../core/flight.service';
import { HotelService } from '../../core/hotel.service';
import { ReservationService } from '../../core/reservation.service';
import {
  FLIGHT_CLASS_CHARGE,
  Flight,
  FlightClass,
  Hotel,
  Reservation,
  ReservationRequest,
} from '../../core/models';

@Component({
  selector: 'app-booking',
  imports: [
    CurrencyPipe,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './booking.html',
})
export class Booking implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly flightService = inject(FlightService);
  private readonly hotelService = inject(HotelService);
  private readonly reservationService = inject(ReservationService);

  protected readonly type = signal<'flight' | 'hotel'>('flight');
  protected readonly flight = signal<Flight | null>(null);
  protected readonly hotel = signal<Hotel | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  protected readonly count = signal(1);
  protected readonly nights = signal(1);
  protected readonly flightClass = signal<FlightClass>('BASIC');
  protected readonly flightClasses: FlightClass[] = ['BASIC', 'FLEX', 'SUPER_FLEX'];

  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly confirmed = signal<Reservation | null>(null);
  protected readonly paymentFailed = signal(false);

  private itemId = 0;

  protected readonly total = computed(() => {
    if (this.type() === 'flight' && this.flight()) {
      return (this.flight()!.price + FLIGHT_CLASS_CHARGE[this.flightClass()]) * this.count();
    }
    if (this.type() === 'hotel' && this.hotel()) {
      return this.hotel()!.price * this.count() * this.nights();
    }
    return 0;
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.type.set(q.get('type') === 'hotel' ? 'hotel' : 'flight');
    this.itemId = Number(q.get('flightId') ?? q.get('hotelId') ?? 0);

    if (!this.itemId) {
      this.loadError.set('Nothing to book.');
      this.loading.set(false);
      return;
    }

    const request$: Observable<Flight | Hotel> =
      this.type() === 'flight'
        ? this.flightService.getById(this.itemId)
        : this.hotelService.getById(this.itemId);

    request$.subscribe({
      next: (item) => {
        if (this.type() === 'flight') {
          this.flight.set(item as Flight);
        } else {
          this.hotel.set(item as Hotel);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Could not load the selected item.');
        this.loading.set(false);
      },
    });
  }

  confirm(): void {
    const userId = this.auth.userId();
    if (userId == null) {
      this.submitError.set('Your session expired. Please sign in again.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);
    this.paymentFailed.set(false);

    const request: ReservationRequest =
      this.type() === 'flight'
        ? { userId, flightId: this.itemId, flightPassengers: this.count(), flightClass: this.flightClass() }
        : { userId, hotelId: this.itemId, hotelPassengers: this.count(), numberOfNights: this.nights() };

    this.reservationService.create(request).subscribe({
      next: (reservation) => {
        this.confirmed.set(reservation);
        this.submitting.set(false);
      },
      error: (err: { status?: number }) => {
        if (err.status === 402) {
          this.paymentFailed.set(true);
        } else {
          this.submitError.set('Something went wrong. Please try again.');
        }
        this.submitting.set(false);
      },
    });
  }
}
