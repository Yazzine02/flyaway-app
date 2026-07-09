import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Aircraft {
  icao24: string;
  callsign: string;
  country: string;
  longitude: number;
  latitude: number;
  altitude: number | null;
  onGround: boolean;
  velocity: number | null;
  track: number | null;
}

export interface MapBounds {
  lamin: number;
  lomin: number;
  lamax: number;
  lomax: number;
}

// Same-origin path; proxied to OpenSky (dev: proxy.conf.json, prod: server.ts)
// because their API does not allow cross-origin browser requests.
const OPENSKY_URL = '/opensky/states/all';

// OpenSky state vectors are positional arrays; see their REST API docs.
type StateVector = (string | number | boolean | null)[];

@Injectable({ providedIn: 'root' })
export class OpenSkyService {
  private readonly http = inject(HttpClient);

  // Live aircraft within a bounding box (anonymous access, rate-limited).
  getStates(bounds: MapBounds): Observable<Aircraft[]> {
    const params = new HttpParams()
      .set('lamin', bounds.lamin)
      .set('lomin', bounds.lomin)
      .set('lamax', bounds.lamax)
      .set('lomax', bounds.lomax);

    return this.http
      .get<{ states: StateVector[] | null }>(OPENSKY_URL, { params })
      .pipe(map((res) => (res.states ?? []).map(toAircraft).filter(hasPosition)));
  }
}

function toAircraft(s: StateVector): Aircraft {
  return {
    icao24: String(s[0] ?? ''),
    callsign: String(s[1] ?? '').trim(),
    country: String(s[2] ?? ''),
    longitude: s[5] as number,
    latitude: s[6] as number,
    altitude: (s[7] ?? s[13]) as number | null,
    onGround: Boolean(s[8]),
    velocity: s[9] as number | null,
    track: s[10] as number | null,
  };
}

function hasPosition(a: Aircraft): boolean {
  return a.longitude != null && a.latitude != null;
}
