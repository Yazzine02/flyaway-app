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
