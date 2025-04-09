import { Component, OnInit, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { MENU_RESOURCE } from '../../resources/menu.resource';
import { SongComponent } from '../../components/song/song.component';
import { Song } from '../../models/song.model';
import { Router, RouterModule } from '@angular/router';
import { ContentComponent } from '../../components/content/content.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Artist } from '../../models/artist.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingComponent, LoadingState } from '../../components/loading/loading.component';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { SongFacade } from '../../core/facades/song.facade';
import { Memo } from '../../core/utils/memoize.util';
import { SongSkeletonComponent } from '../../components/skeleton/song-skeleton/song-skeleton.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-songs-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ContentComponent,
    CommonModule,
    SongComponent,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule,
    LoadingComponent,
    TranslateModule,
    SongSkeletonComponent,
    MatCardModule,
  ],
  animations: [
    trigger('staggerList', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('70ms', [
              animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
  template: `
    <app-header
      [showMenu]="true"
      (onMenuClick)="menu.toggleMenu()"
      [showSearch]="true"
      [searchQuery]="searchQuery()"
      [searchPlaceholder]="'SONGS.SEARCH_PLACEHOLDER'"
      (onSearchChange)="updateSearchQuery($event)"
      [title]="'MENU.SONGS'"
    />

    <app-content>
      <!-- Loading skeleton -->
      <div *ngIf="loadingState() === 'loading'" class="songs-page__grid">
        <app-song-skeleton *ngFor="let i of [1, 2, 3, 4, 5, 6]"></app-song-skeleton>
      </div>

      <!-- Error or empty -->
      <app-loading
        *ngIf="loadingState() !== 'success' && loadingState() !== 'loading'"
        [state]="loadingState()"
        [emptyText]="emptySearchText()"
        [errorText]="errorMessage()"
        (retryEvent)="loadSongs()"
      ></app-loading>

      <!-- Loaded content -->
      <div
        *ngIf="loadingState() === 'success'"
        class="songs-page__grid"
        [@staggerList]="filteredSongs().length"
      >
        <!-- Add song card for large screens -->
        <mat-card class="songs-page__add-card" (click)="addSong()">
          <div class="songs-page__add-image-container">
            <div class="songs-page__add-content">
              <mat-icon class="songs-page__add-icon">add</mat-icon>
              <span class="songs-page__add-text">{{ 'COMMON.ADD' | translate }}</span>
            </div>
          </div>
        </mat-card>

        <a
          *ngFor="let song of filteredSongs(); trackBy: trackById"
          [routerLink]="['/songs', song.id]"
          class="songs-page__link"
        >
          <app-song [song]="song" [artist]="getArtistBySongArtistId(song.artistId)" />
        </a>
      </div>

      <!-- Floating add button for small screens -->
      <button
        mat-fab
        color="primary"
        [attr.aria-label]="'COMMON.ADD' | translate"
        class="songs-page__add-button"
        (click)="addSong()"
      >
        <mat-icon>add</mat-icon>
      </button>
    </app-content>
  `,
  styles: `
    .songs-page {
      &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.5rem;
        align-items: start;
      }

      &__link {
        display: block;
        transition: transform 0.2s ease-in-out;

        &:hover {
          transform: translateY(-4px);
        }
      }

      &__add-card {
        display: none;
        cursor: pointer;
        height: 100%;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition:
          transform 0.3s,
          box-shadow 0.3s;
        border: 2px dashed #e0e0e0;

        &:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-8px);
          border-color: #2196f3;
          background-color: #f5f5f5;

          .songs-page__add-icon {
            transform: scale(1.1);
          }
        }
      }

      &__add-image-container {
        aspect-ratio: 3 / 2;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__add-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
        height: 100%;
      }

      &__add-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: #2196f3;
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__add-text {
        font-size: 1rem;
        color: #666;
        text-align: center;
        display: block;
        width: 100%;
      }

      &__add-button {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 999;
      }
    }

    @media (min-width: 1160px) {
      .songs-page {
        &__add-button {
          display: none;
        }

        &__add-card {
          display: block;
        }
      }
    }

    @media (max-width: 600px) {
      .songs-page {
        &__grid {
          grid-template-columns: 1fr;
        }
      }
    }
  `,
})
export class SongsPage implements OnInit, OnDestroy {
  readonly menu = inject(MENU_RESOURCE);
  private readonly songFacade = inject(SongFacade);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);

  private destroy$ = new Subject<void>();

  readonly songs = this.songFacade.songs;
  readonly artists = this.songFacade.artists;

  searchQuery = signal<string>('');
  loadingState = signal<LoadingState>('loading');
  errorMessage = signal<string>('');

  constructor() {
    effect(() => {
      const songs = this.filteredSongs();
      const query = this.searchQuery();

      if (songs.length === 0 && query.trim() !== '') {
        this.loadingState.set('empty');
      } else if (songs.length > 0) {
        this.loadingState.set('success');
      }
    });
  }

  filteredSongs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const songs = this.songs();

    if (!songs || songs.length === 0) {
      return [];
    }

    if (!query) return songs;

    return songs.filter((song) => {
      if (song.title.toLowerCase().includes(query)) return true;

      if (song.genre && song.genre.some((g) => g.toLowerCase().includes(query))) return true;

      const artist = this.getArtistBySongArtistId(song.artistId);
      if (artist?.name.toLowerCase().includes(query)) return true;

      return false;
    });
  });

  ngOnInit(): void {
    this.loadSongs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSongs(): void {
    this.loadingState.set('loading');
    this.updateErrorMessage();

    // // Simulate async loading
    // setTimeout(() => {
    //   const songs = this.songs();
    //   const artists = this.artists();

    //   if (!songs || !artists) {
    //     this.loadingState.set('error');
    //     this.errorMessage.set(this.translateService.instant('ERRORS.LOADING_SONGS'));
    //     return;
    //   }

    //   if (songs.length === 0) {
    //     this.loadingState.set('empty');
    //   } else {
    //     this.loadingState.set('success');
    //   }
    // }, 500);
  }

  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  updateErrorMessage(): void {
    this.errorMessage.set(this.translateService.instant('ERRORS.LOADING_SONGS'));
  }

  addSong(): void {
    this.router.navigate(['/songs', 'new']);
  }

  emptySearchText(): string {
    return this.translateService.instant('SONGS.NOT_FOUND') + ': ' + this.searchQuery();
  }

  @Memo
  getArtistBySongArtistId(artistId: string | number | undefined): Artist | undefined {
    if (!artistId) {
      console.log('[SongsPage] getArtistBySongArtistId: No hay artistId proporcionado');
      return undefined;
    }
    const artist = this.artists().find((a) => String(a.id) === String(artistId));
    return artist;
  }

  trackById(index: number, song: Song): number {
    return song.id;
  }
}
