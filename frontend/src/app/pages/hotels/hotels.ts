import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HotelService } from '../../core/hotel.service';
import { Hotel } from '../../core/models';

@Component({
  selector: 'app-hotels',
  imports: [
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './hotels.html',
})
export class Hotels implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly hotelService = inject(HotelService);

  protected readonly hotels = signal<Hotel[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly city = signal('');

  ngOnInit(): void {
    this.city.set(this.route.snapshot.queryParamMap.get('city') ?? '');
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const request$ = this.city()
      ? this.hotelService.search(this.city())
      : this.hotelService.getAll();

    request$.subscribe({
      next: (hotels) => {
        this.hotels.set(hotels ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load hotels. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
