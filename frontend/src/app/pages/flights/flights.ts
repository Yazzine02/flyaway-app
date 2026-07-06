import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlightService } from '../../core/flight.service';
import { Flight } from '../../core/models';

@Component({
  selector: 'app-flights',
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './flights.html',
})
export class Flights implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly flightService = inject(FlightService);

  protected readonly flights = signal<Flight[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly departure = signal('');
  protected readonly destination = signal('');
  protected readonly date = signal('');

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.departure.set(q.get('departure') ?? '');
    this.destination.set(q.get('destination') ?? '');
    this.date.set(q.get('date') ?? '');
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const hasQuery = this.departure() && this.destination() && this.date();
    const request$ = hasQuery
      ? this.flightService.search(this.departure(), this.destination(), this.date())
      : this.flightService.getAll();

    request$.subscribe({
      next: (flights) => {
        this.flights.set(flights ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load flights. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
