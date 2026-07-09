import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import type * as Leaflet from 'leaflet';
import { Aircraft, OpenSkyService } from '../../core/opensky.service';

const REFRESH_MS = 30_000;
const MAX_MARKERS = 400;
const PLANE_PATH =
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z';

@Component({
  selector: 'app-flight-map',
  imports: [DatePipe, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './flight-map.html',
})
export class FlightMap implements OnDestroy {
  private readonly openSky = inject(OpenSkyService);
  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');

  private L?: typeof Leaflet;
  private map?: Leaflet.Map;
  private markers?: Leaflet.LayerGroup;
  private refreshTimer?: ReturnType<typeof setInterval>;
  private moveTimer?: ReturnType<typeof setTimeout>;

  protected readonly count = signal(0);
  protected readonly updatedAt = signal<Date | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    // Leaflet touches window/document, so the map only exists in the browser.
    afterNextRender(() => void this.initMap());
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshTimer);
    clearTimeout(this.moveTimer);
    this.map?.remove();
  }

  private async initMap(): Promise<void> {
    try {
      this.L = await import('leaflet');
      const map = this.L.map(this.mapEl().nativeElement, {
        center: [46, 6],
        zoom: 5,
        worldCopyJump: true,
      });
      this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      this.markers = this.L.layerGroup().addTo(map);
      this.map = map;

      map.on('moveend', () => {
        clearTimeout(this.moveTimer);
        this.moveTimer = setTimeout(() => this.refresh(), 1_500);
      });

      this.refresh();
      this.refreshTimer = setInterval(() => this.refresh(), REFRESH_MS);
    } catch {
      this.error.set('Could not initialize the map.');
    }
  }

  refresh(): void {
    if (!this.map || this.loading()) {
      return;
    }
    const b = this.map.getBounds();
    this.loading.set(true);
    this.openSky
      .getStates({
        lamin: b.getSouth(),
        lomin: b.getWest(),
        lamax: b.getNorth(),
        lomax: b.getEast(),
      })
      .subscribe({
        next: (aircraft) => {
          this.render(aircraft);
          this.updatedAt.set(new Date());
          this.error.set(null);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Live data is unavailable right now (OpenSky rate limit). Try again in a minute.');
          this.loading.set(false);
        },
      });
  }

  private render(aircraft: Aircraft[]): void {
    if (!this.L || !this.markers) {
      return;
    }
    const airborne = aircraft.filter((a) => !a.onGround).slice(0, MAX_MARKERS);
    this.markers.clearLayers();

    for (const a of airborne) {
      const icon = this.L.divIcon({
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        html: `<div style="transform: rotate(${a.track ?? 0}deg)">
                 <svg viewBox="0 0 24 24" width="22" height="22" fill="#0284c7"><path d="${PLANE_PATH}"/></svg>
               </div>`,
      });
      this.L.marker([a.latitude, a.longitude], { icon })
        .bindPopup(
          `<b>${a.callsign || a.icao24}</b><br>${a.country}` +
            `<br>Altitude: ${a.altitude != null ? Math.round(a.altitude) + ' m' : '—'}` +
            `<br>Speed: ${a.velocity != null ? Math.round(a.velocity * 3.6) + ' km/h' : '—'}`,
        )
        .addTo(this.markers);
    }
    this.count.set(airborne.length);
  }
}
