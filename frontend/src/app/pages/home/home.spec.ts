import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should list popular destinations', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('article');
    expect(cards.length).toBe(4);
  });
});
