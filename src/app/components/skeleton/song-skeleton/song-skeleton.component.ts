import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../skeleton.component';

@Component({
  selector: 'app-song-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="song-skeleton">
      <app-skeleton type="rect" height="160px" class="song-skeleton__image"></app-skeleton>
      <div class="song-skeleton__content">
        <app-skeleton type="text" width="70%" class="song-skeleton__title"></app-skeleton>
        <app-skeleton type="text" width="40%" class="song-skeleton__artist"></app-skeleton>
      </div>
    </div>
  `,
  styles: `
    .song-skeleton {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-4px);
      }

      &__image {
        width: 100%;
        aspect-ratio: 1;
      }

      &__content {
        padding: 1rem;
      }

      &__title {
        margin-bottom: 0.5rem;
      }

      &__artist {
        margin-bottom: 0;
      }
    }
  `,
})
export class SongSkeletonComponent {}
