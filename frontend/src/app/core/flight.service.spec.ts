import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FlightService } from './flight.service';

describe('FlightService', () => {
  let service: FlightService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(FlightService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('builds a search request with query params', () => {
    service.search('CMN', 'CDG', '2026-08-01').subscribe();
    const req = http.expectOne(
      (r) => r.url === '/api/flights/search' && r.params.get('departure') === 'CMN',
    );
    expect(req.request.params.get('destination')).toBe('CDG');
    expect(req.request.params.get('date')).toBe('2026-08-01');
    req.flush([]);
  });

  it('fetches all flights', () => {
    service.getAll().subscribe();
    const req = http.expectOne('/api/flights');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
