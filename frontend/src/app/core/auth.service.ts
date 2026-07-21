import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest } from './models';

const TOKEN_KEY = 'flyaway_token';
const USER_KEY = 'flyaway_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _token = signal<string | null>(this.read(TOKEN_KEY));
  readonly username = signal<string | null>(this.read(USER_KEY));
  readonly userId = computed(() => this.decodePayload(this._token())?.userId ?? null);
  readonly isAuthenticated = computed(() => {
    const token = this._token();
    return !!token && !this.isExpired(token);
  });

  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/login', req)
      .pipe(tap((res) => this.setSession(res.token, req.username)));
  }

  register(req: RegisterRequest): Observable<unknown> {
    return this.http.post('/api/users/register', { role: 'USER', ...req });
  }

  logout(): void {
    this._token.set(null);
    this.username.set(null);
    this.clear(TOKEN_KEY);
    this.clear(USER_KEY);
  }

  getToken(): string | null {
    return this._token();
  }

  // Decodes the JWT payload; returns null for a missing or malformed token.
  private decodePayload(token: string | null): { userId?: number; exp?: number } | null {
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  // Only treats a token as expired when it carries an exp claim in the past.
  private isExpired(token: string): boolean {
    const exp = this.decodePayload(token)?.exp;
    return exp != null && exp * 1000 <= Date.now();
  }

  private setSession(token: string, username: string): void {
    this._token.set(token);
    this.username.set(username);
    this.write(TOKEN_KEY, token);
    this.write(USER_KEY, username);
  }

  private read(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  private write(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
  }

  private clear(key: string): void {
    if (this.isBrowser) localStorage.removeItem(key);
  }
}
