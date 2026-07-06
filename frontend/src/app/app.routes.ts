import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'FlyAway — Book flights & hotels' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'Sign in — FlyAway',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
    title: 'Register — FlyAway',
  },
  {
    path: 'flights',
    loadComponent: () => import('./pages/flights/flights').then((m) => m.Flights),
    canActivate: [authGuard],
    title: 'Flights — FlyAway',
  },
  {
    path: 'hotels',
    loadComponent: () => import('./pages/hotels/hotels').then((m) => m.Hotels),
    canActivate: [authGuard],
    title: 'Hotels — FlyAway',
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking').then((m) => m.Booking),
    canActivate: [authGuard],
    title: 'Booking — FlyAway',
  },
  { path: '**', redirectTo: '' },
];
