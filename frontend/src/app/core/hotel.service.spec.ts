import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HotelService } from './hotel.service';

describe('HotelService', () => {
  let service: HotelService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(HotelService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('searches by city', () => {
    service.search('Paris').subscribe();
    const req = http.expectOne(
      (r) => r.url === '/api/hotels/search' && r.params.get('city') === 'Paris',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('fetches a hotel by id', () => {
    service.getById(7).subscribe();
    const req = http.expectOne('/api/hotels/7');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 7, name: 'Ritz', city: 'Paris', price: 300 });
  });
});
