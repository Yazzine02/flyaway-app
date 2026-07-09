export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface Flight {
  id: number;
  flightName: string;
  departure: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  price: number;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  price: number;
}

export type FlightClass = 'BASIC' | 'FLEX' | 'SUPER_FLEX';

export const FLIGHT_CLASS_CHARGE: Record<FlightClass, number> = {
  BASIC: 0,
  FLEX: 200,
  SUPER_FLEX: 600,
};

export type ReservationStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';

export interface ReservationRequest {
  userId: number;
  flightId?: number | null;
  hotelId?: number | null;
  flightPassengers?: number;
  hotelPassengers?: number;
  numberOfNights?: number;
  flightClass?: FlightClass;
}

export interface Reservation {
  id: number;
  userId: number;
  flightId: number | null;
  hotelId: number | null;
  status: ReservationStatus;
  flightPassengers: number;
  hotelPassengers: number;
  flightClass: FlightClass | null;
  totalPrice: number;
  date: string;
}
