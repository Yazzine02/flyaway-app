import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Bookings } from './bookings';

describe('Bookings', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookings],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('renders the booking history', async () => {
    const fixture = TestBed.createComponent(Bookings);
    fixture.detectChanges();

    http.expectOne('/api/reservations/mine').flush([
      {
        id: 5, userId: 1, flightId: 2, hotelId: null, status: 'CONFIRMED',
        flightPassengers: 1, hotelPassengers: 1, flightClass: 'FLEX',
        totalPrice: 520, date: '2026-07-01T10:00:00',
      },
    ]);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Reservation #5');
    expect(text).toContain('CONFIRMED');
  });

  it('shows an empty state when there are no bookings', async () => {
    const fixture = TestBed.createComponent(Bookings);
    fixture.detectChanges();

    http.expectOne('/api/reservations/mine').flush([]);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No bookings yet');
  });
});
