import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from './auth.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpMock.verify());

  it('logs out and redirects on 401 for an authenticated request', () => {
    auth.login({ username: 'a', password: 'b' }).subscribe();
    httpMock.expectOne('/api/auth/login').flush({ token: 'jwt-123' });
    const navSpy = spyOn(router, 'navigate');

    http.get('/api/flights').subscribe({ next: () => {}, error: () => {} });
    httpMock.expectOne('/api/flights').flush('nope', { status: 401, statusText: 'Unauthorized' });

    expect(auth.getToken()).toBeNull();
    expect(navSpy).toHaveBeenCalledWith(['/login'], jasmine.anything());
  });

  it('does not redirect on 401 without a session', () => {
    const navSpy = spyOn(router, 'navigate');

    http.post('/api/auth/login', {}).subscribe({ next: () => {}, error: () => {} });
    httpMock.expectOne('/api/auth/login').flush('bad', { status: 401, statusText: 'Unauthorized' });

    expect(navSpy).not.toHaveBeenCalled();
  });
});
