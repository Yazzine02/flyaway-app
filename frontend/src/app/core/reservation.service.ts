import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest } from './models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly http = inject(HttpClient);

  // 201 -> confirmed; 402 error carries a FAILED reservation in the body.
  create(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>('/api/reservations', request);
  }

  // Booking history for the authenticated user (identity from the JWT).
  getMine(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>('/api/reservations/mine');
  }
}
