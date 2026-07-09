import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ReservationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts a reservation request', () => {
    const payload = { userId: 1, hotelId: 7, hotelPassengers: 2, numberOfNights: 3 };
    service.create(payload).subscribe();
    const req = http.expectOne('/api/reservations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 10, userId: 1, flightId: null, hotelId: 7, status: 'CONFIRMED', totalPrice: 900 });
  });

  it('fetches the current user bookings', () => {
    let result: unknown;
    service.getMine().subscribe((r) => (result = r));
    const req = http.expectOne('/api/reservations/mine');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, status: 'CONFIRMED', totalPrice: 320 }]);
    expect((result as unknown[]).length).toBe(1);
  });
});
