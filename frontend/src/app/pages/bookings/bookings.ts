import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReservationService } from '../../core/reservation.service';
import { Reservation, ReservationStatus } from '../../core/models';

@Component({
  selector: 'app-bookings',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './bookings.html',
})
export class Bookings implements OnInit {
  private readonly reservationService = inject(ReservationService);

  protected readonly reservations = signal<Reservation[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.reservationService.getMine().subscribe({
      next: (reservations) => {
        this.reservations.set(reservations ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load your bookings. Please try again.');
        this.loading.set(false);
      },
    });
  }

  statusClass(status: ReservationStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  }
}
