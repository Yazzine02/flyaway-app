import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

interface Destination {
  city: string;
  country: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly mode = signal<'flights' | 'hotels'>('flights');

  protected readonly origin = signal('');
  protected readonly destination = signal('');
  protected readonly date = signal('');

  protected readonly destinations: Destination[] = [
    { city: 'Tokyo', country: 'Japan', price: 612, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=60' },
    { city: 'Paris', country: 'France', price: 248, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=60' },
    { city: 'New York', country: 'USA', price: 389, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=60' },
    { city: 'Marrakech', country: 'Morocco', price: 175, image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=60' },
  ];

  // Flight search is wired to the backend in a later feature.
  search(): void {
    console.log('search', this.mode(), this.origin(), this.destination(), this.date());
  }
}
