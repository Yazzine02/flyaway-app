import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from './models';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private readonly http = inject(HttpClient);

  search(departure: string, destination: string, date: string): Observable<Flight[]> {
    const params = new HttpParams()
      .set('departure', departure)
      .set('destination', destination)
      .set('date', date);
    return this.http.get<Flight[]>('/api/flights/search', { params });
  }

  getAll(): Observable<Flight[]> {
    return this.http.get<Flight[]>('/api/flights');
  }

  getById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`/api/flights/${id}`);
  }
}
