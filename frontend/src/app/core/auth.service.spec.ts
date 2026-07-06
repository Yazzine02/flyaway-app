import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('stores the token and username after login', () => {
    service.login({ username: 'alice', password: 'pw' }).subscribe();
    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-123' });

    expect(service.getToken()).toBe('jwt-123');
    expect(service.username()).toBe('alice');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('clears the session on logout', () => {
    service.login({ username: 'bob', password: 'pw' }).subscribe();
    http.expectOne('/api/auth/login').flush({ token: 'jwt-xyz' });

    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
