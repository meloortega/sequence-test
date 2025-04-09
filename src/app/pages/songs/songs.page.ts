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
        <a
          *ngFor="let song of filteredSongs(); trackBy: trackById"
          [routerLink]="['/songs', song.id]"
          class="songs-page__link"
        >
          <app-song [song]="song" [artist]="getArtistBySongArtistId(song.artistId)" />
        </a>
      </div>

      <button
        mat-fab
        color="primary"
        [attr.aria-label]="'SONGS.ADD' | translate"
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

      &__add-button {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 999;
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
