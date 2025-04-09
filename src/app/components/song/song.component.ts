import { Component, computed, input } from '@angular/core';
import { Song } from '../../models/song.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Artist } from '../../models/artist.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-song',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatTooltipModule, MatIconModule],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          }),
        ),
      ]),
    ]),
    trigger('imageHover', [
      transition('* => hovered', [animate('300ms ease-out', style({ transform: 'scale(1.05)' }))]),
      transition('hovered => *', [animate('300ms ease-out', style({ transform: 'scale(1.0)' }))]),
    ]),
  ],
  template: `
    <mat-card
      class="song"
      @cardAnimation
      (mouseenter)="imageState = 'hovered'"
      (mouseleave)="imageState = 'default'"
    >
      <div class="song__image-container">
        <img
          mat-card-image
          [src]="image()"
          alt="Song Image"
          class="song__image"
          [@imageHover]="imageState"
        />
        <div class="song__rating" *ngIf="rating() !== undefined">
          <div class="song__rating-badge">
            <mat-icon class="song__rating-icon">star</mat-icon>
            <span>{{ rating() | number: '1.1-1' }}</span>
          </div>
        </div>
      </div>

      <mat-card-title-group class="song__title-group">
        <mat-card-title>
          <span class="song__title" [matTooltip]="title()">{{ title() }}</span>
        </mat-card-title>
        <mat-card-subtitle>
          <span class="song__artist" [matTooltip]="artistName()">{{ artistName() }}</span>
        </mat-card-subtitle>
      </mat-card-title-group>

      <div class="song__details">
        <div class="song__year-duration">
          <span class="song__year" *ngIf="year()">{{ year() }}</span>
          <span class="song__duration" *ngIf="duration()">{{ formatDuration(duration()!) }}</span>
        </div>
      </div>

      <div class="song__genres">
        <mat-card-content>
          <div class="song__genre-list">
            <mat-chip *ngFor="let genre of genres()" color="primary" selected>
              {{ genre }}
            </mat-chip>
          </div>
        </mat-card-content>
      </div>
    </mat-card>
  `,
  styles: `
    .song {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition:
        transform 0.3s,
        box-shadow 0.3s;

      &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-8px);
      }

      &__image-container {
        aspect-ratio: 3 / 2;
        width: 100%;
        overflow: hidden;
        position: relative;
      }

      &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &__rating {
        position: absolute;
        top: 8px;
        right: 8px;
      }

      &__rating-badge {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.7);
        color: #ffd700;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 0.85rem;
      }

      &__rating-icon {
        font-size: 1rem;
        height: 1rem;
        width: 1rem;
        margin-right: 2px;
      }

      &__title-group {
        padding: 1rem 1rem 0.5rem 1rem;
      }

      &__title,
      &__artist {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }

      &__title {
        font-weight: 500;
        font-size: 1.1rem;
      }

      &__artist {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      &__details {
        padding: 0 1rem;
      }

      &__year-duration {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 0.5rem;
      }

      &__genres {
        overflow-x: hidden;
        margin-top: auto;
      }

      &__genre-list {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding: 0.5rem 1rem 1rem;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    @media (max-width: 600px) {
      .song {
        &__title {
          font-size: 1rem;
        }

        &__artist {
          font-size: 0.8rem;
        }
      }
    }
  `,
})
export class SongComponent {
  song = input<Song>();
  artist = input<Artist>();
  imageState: 'default' | 'hovered' = 'default';

  image = computed(() => this.song()?.poster);
  title = computed(() => this.song()?.title ?? 'Sin título');
  artistName = computed(() => {
    const song = this.song();
    const artist = this.artist();

    if (!artist) {
      if (song?.artistId) {
        return 'Artista desconocido';
      } else {
        return 'Sin artista';
      }
    }

    return artist.name ?? 'Sin nombre';
  });
  genres = computed(() => this.song()?.genre ?? []);
  year = computed(() => this.song()?.year);
  duration = computed(() => this.song()?.duration);
  rating = computed(() => this.song()?.rating);

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
