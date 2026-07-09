import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Aircraft, OpenSkyService } from './opensky.service';

describe('OpenSkyService', () => {
  let service: OpenSkyService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OpenSkyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const bounds = { lamin: 40, lomin: -10, lamax: 55, lomax: 15 };

  it('queries OpenSky with the bounding box and parses state vectors', () => {
    let result: Aircraft[] = [];
    service.getStates(bounds).subscribe((a) => (result = a));

    const req = http.expectOne(
      (r) =>
        r.url === '/opensky/states/all' &&
        r.params.get('lamin') === '40' &&
        r.params.get('lomax') === '15',
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      time: 1_700_000_000,
      states: [
        ['abc123', 'RAM200  ', 'Morocco', null, null, -7.6, 33.5, 11000, false, 250, 45, 0, null, 11200, null, false, 0],
        ['nopos1', 'GHOST', 'Nowhere', null, null, null, null, null, false, null, null, 0, null, null, null, false, 0],
      ],
    });

    expect(result.length).toBe(1);
    expect(result[0].callsign).toBe('RAM200');
    expect(result[0].latitude).toBe(33.5);
    expect(result[0].track).toBe(45);
  });

  it('returns an empty list when states is null', () => {
    let result: Aircraft[] | undefined;
    service.getStates(bounds).subscribe((a) => (result = a));
    http.expectOne(() => true).flush({ time: 0, states: null });
    expect(result).toEqual([]);
  });
});
