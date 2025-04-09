import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongComponent } from './song.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Song } from '../../models/song.model';
import { Artist } from '../../models/artist.model';

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;

  const mockSong: Song = {
    id: 1,
    title: 'Test Song',
    poster: 'http://example.com/image.jpg',
    genre: ['Rock', 'Pop'],
    year: 2020,
    duration: 180,
    rating: 8.5,
    artistId: 1,
  };

  const mockArtist: Artist = {
    id: 1,
    name: 'Test Artist',
    bornCity: 'Test City',
    birthdate: '01/01/1990',
    img: 'http://example.com/artist.jpg',
    rating: 9.0,
    songs: [1],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SongComponent,
        MatCardModule,
        MatChipsModule,
        MatTooltipModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display song title', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.detectChanges();

    const titleElement = newFixture.nativeElement.querySelector('.song__title');
    expect(titleElement.textContent.trim()).toBe('Test Song');
  });

  it('should display artist name', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.componentRef.setInput('artist', mockArtist);
    newFixture.detectChanges();

    const artistElement = newFixture.nativeElement.querySelector('.song__artist');
    expect(artistElement.textContent.trim()).toBe('Test Artist');
  });

  it('should display song year', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.detectChanges();

    const yearElement = newFixture.nativeElement.querySelector('.song__year');
    expect(yearElement.textContent.trim()).toBe('2020');
  });

  it('should display formatted duration', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.detectChanges();

    const durationElement = newFixture.nativeElement.querySelector('.song__duration');
    expect(durationElement.textContent.trim()).toBe('3:00');
  });

  it('should display song rating', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.detectChanges();

    const ratingElement = newFixture.nativeElement.querySelector('.song__rating-badge span');
    expect(ratingElement.textContent.trim()).toBe('8.5');
  });

  it('should display song genres as chips', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.detectChanges();

    const genreChips = newFixture.nativeElement.querySelectorAll('mat-chip');
    expect(genreChips.length).toBe(2);
    expect(genreChips[0].textContent.trim()).toBe('Rock');
    expect(genreChips[1].textContent.trim()).toBe('Pop');
  });

  it('should handle missing artist gracefully', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.componentRef.setInput('artist', undefined);
    newFixture.detectChanges();

    const artistElement = newFixture.nativeElement.querySelector('.song__artist');
    expect(artistElement.textContent.trim()).toBe('Artista desconocido');
  });

  it('should handle missing song data gracefully', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', undefined);
    newFixture.detectChanges();

    const titleElement = newFixture.nativeElement.querySelector('.song__title');
    expect(titleElement.textContent.trim()).toBe('Sin título');
  });

  it('should apply hover animation class on mouseenter', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.detectChanges();

    const cardElement = newFixture.nativeElement.querySelector('mat-card');
    cardElement.dispatchEvent(new Event('mouseenter'));
    newFixture.detectChanges();

    expect(newFixture.componentInstance.imageState).toBe('hovered');
  });

  it('should remove hover animation class on mouseleave', () => {
    const newFixture = TestBed.createComponent(SongComponent);
    newFixture.componentRef.setInput('song', mockSong);
    newFixture.detectChanges();

    const cardElement = newFixture.nativeElement.querySelector('mat-card');
    cardElement.dispatchEvent(new Event('mouseenter'));
    newFixture.detectChanges();
    expect(newFixture.componentInstance.imageState).toBe('hovered');

    cardElement.dispatchEvent(new Event('mouseleave'));
    newFixture.detectChanges();
    expect(newFixture.componentInstance.imageState).toBe('default');
  });
});
