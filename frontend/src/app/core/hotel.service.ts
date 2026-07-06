import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from './models';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private readonly http = inject(HttpClient);

  search(city: string): Observable<Hotel[]> {
    const params = new HttpParams().set('city', city);
    return this.http.get<Hotel[]>('/api/hotels/search', { params });
  }

  getAll(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>('/api/hotels');
  }

  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`/api/hotels/${id}`);
  }
}
