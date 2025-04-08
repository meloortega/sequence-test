import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../skeleton.component';

@Component({
  selector: 'app-song-detail-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="song-detail-skeleton">
      <div class="song-detail-skeleton__image">
        <app-skeleton type="rect" height="300px"></app-skeleton>
      </div>

      <div class="song-detail-skeleton__form">
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>
        <app-skeleton type="text" width="100%" class="song-detail-skeleton__field"></app-skeleton>

        <div class="song-detail-skeleton__actions">
          <app-skeleton type="rect" width="120px" height="36px"></app-skeleton>
          <app-skeleton type="rect" width="120px" height="36px"></app-skeleton>
        </div>
      </div>
    </div>
  `,
  styles: `
    .song-detail-skeleton {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;

      &__image {
        margin-bottom: 2rem;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }

      &__form {
        display: flex;
        flex-direction: column;
        max-width: 800px;
        margin: 0 auto;
        gap: 1rem;
      }

      &__field {
        height: 56px;
      }

      &__actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: flex-end;
      }
    }
  `,
})
export class SongDetailSkeletonComponent {}
