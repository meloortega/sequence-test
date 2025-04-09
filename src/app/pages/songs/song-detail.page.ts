import { Component, OnInit, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Song } from '../../models/song.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../components/header/header.component';
import { ContentComponent } from '../../components/content/content.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Company } from '../../models/company.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Artist } from '../../models/artist.model';
import { Subject, finalize, firstValueFrom, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SongFacade } from '../../core/facades/song.facade';
import { Memo } from '../../core/utils/memoize.util';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipGrid, MatChipRow } from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { SongDetailSkeletonComponent } from '../../components/skeleton/song-detail-skeleton/song-detail-skeleton.component';

@Component({
  selector: 'app-song-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ContentComponent,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HeaderComponent,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatChipGrid,
    MatChipRow,
    SongDetailSkeletonComponent,
  ],
  template: `
    <app-header
      [showBackButton]="true"
      (backButtonClick)="goBack()"
      [titleAlignment]="'center'"
      [title]="isNew ? 'SONGS.NEW_SONG' : (song()?.title ?? '') + ' - ' + (artist()?.name ?? '')"
    />
    <app-content>
      <div class="song-detail">
        <!-- Loading skeleton -->
        <app-song-detail-skeleton *ngIf="loading()"></app-song-detail-skeleton>

        <!-- Form -->
        <form
          [formGroup]="songForm"
          (ngSubmit)="saveChanges()"
          novalidate
          class="song-detail__form"
          *ngIf="!loading()"
          [class.song-detail__form--disabled]="submitting()"
        >
          <div class="song-detail__image-preview" *ngIf="posterControl.value">
            <img
              [src]="posterControl.value"
              [attr.alt]="'SONGS.IMAGE_PREVIEW' | translate"
              class="song-detail__image"
              (error)="onImageError($event)"
            />
          </div>

          <!-- Poster field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.POSTER' | translate }}</mat-label>
            <input matInput formControlName="poster" [disabled]="submitting()" />
            <mat-error *ngIf="posterControl.errors?.['required']">
              {{ 'VALIDATION.REQUIRED_POSTER' | translate }}
            </mat-error>
          </mat-form-field>

          <!-- Title field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.SONG_TITLE' | translate }}</mat-label>
            <input matInput formControlName="title" [disabled]="submitting()" />
            <mat-error *ngIf="titleControl.errors?.['required']">
              {{ 'VALIDATION.REQUIRED_TITLE' | translate }}
            </mat-error>
          </mat-form-field>

          <!-- Artist field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.ARTIST' | translate }}</mat-label>
            <mat-select formControlName="artistId" [disabled]="submitting()">
              <mat-option *ngFor="let artist of artists()" [value]="+artist.id">
                {{ artist.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="artistIdControl.errors?.['required']">
              {{ 'VALIDATION.REQUIRED_ARTIST' | translate }}
            </mat-error>
          </mat-form-field>

          <!-- Genres field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.GENRES' | translate }}</mat-label>
            <mat-chip-grid
              #chipGrid
              [attr.aria-label]="'SONGS.GENRES' | translate"
              [disabled]="!isEditing() || submitting()"
            >
              @for (genre of genres; track genre) {
                <mat-chip-row
                  (removed)="removeGenre(genre)"
                  (edited)="editGenre(genre, $event)"
                  [attr.aria-description]="('COMMON.PRESS_ENTER_EDIT' | translate) + ' ' + genre"
                >
                  {{ genre }}
                  <button
                    matChipRemove
                    [attr.aria-label]="('COMMON.REMOVE' | translate) + ' ' + genre"
                  >
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
              }
              <input
                placeholder="{{ 'SONGS.ADD_GENRE' | translate }}"
                [matChipInputFor]="chipGrid"
                [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                [matChipInputAddOnBlur]="addOnBlur"
                (matChipInputTokenEnd)="addGenre($event)"
                [disabled]="submitting()"
              />
            </mat-chip-grid>
          </mat-form-field>

          <!-- Companies field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.COMPANIES' | translate }}</mat-label>
            <mat-select formControlName="companies" multiple [disabled]="submitting()">
              <mat-option *ngFor="let company of companies()" [value]="company.id">
                {{ company.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Year field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.YEAR' | translate }}</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="year"
              (click)="isEditing() && !submitting() && picker.open()"
              readonly
              [disabled]="submitting()"
            />
            <mat-datepicker
              #picker
              startView="multi-year"
              (yearSelected)="onYearSelected($event); picker.close()"
              panelClass="year-only-datepicker"
            ></mat-datepicker>
            <mat-datepicker-toggle
              matSuffix
              [for]="picker"
              [disabled]="!isEditing() || submitting()"
            ></mat-datepicker-toggle>
            <mat-error *ngIf="yearControl.errors?.['required']">
              {{ 'VALIDATION.REQUIRED_YEAR' | translate }}
            </mat-error>
          </mat-form-field>

          <!-- Rating field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.RATING' | translate }}</mat-label>
            <input
              matInput
              type="number"
              step="0.01"
              min="0"
              max="10"
              formControlName="rating"
              [disabled]="submitting()"
            />
            <mat-error *ngIf="ratingControl.errors?.['required']">
              {{ 'VALIDATION.REQUIRED_RATING' | translate }}
            </mat-error>
            <mat-error *ngIf="ratingControl.errors?.['min'] || ratingControl.errors?.['max']">
              {{ 'VALIDATION.RATING_RANGE' | translate }}
            </mat-error>
          </mat-form-field>

          <!-- Duration field -->
          <mat-form-field class="song-detail__field" appearance="outline">
            <mat-label>{{ 'SONGS.DURATION' | translate }}</mat-label>
            <input
              matInput
              type="number"
              min="1"
              formControlName="duration"
              [disabled]="submitting()"
            />
            <mat-error *ngIf="durationControl.errors?.['required']">
              {{ 'VALIDATION.REQUIRED_DURATION' | translate }}
            </mat-error>
            <mat-error *ngIf="durationControl.errors?.['min']">
              {{ 'VALIDATION.DURATION_MIN' | translate }}
            </mat-error>
          </mat-form-field>

          <!-- Actions -->
          <div class="song-detail__actions">
            <button
              *ngIf="!isNew && !isEditing()"
              mat-flat-button
              color="primary"
              type="button"
              (click)="enableEditing()"
              class="song-detail__action-button"
              [disabled]="submitting()"
            >
              <mat-icon class="song-detail__action-icon">edit</mat-icon>
              {{ 'ACTIONS.EDIT' | translate }}
            </button>

            <ng-container *ngIf="isEditing()">
              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="songForm.invalid || submitting()"
                class="song-detail__action-button song-detail__action-button--save"
              >
                <div class="song-detail__button-content">
                  <mat-spinner
                    *ngIf="submitting()"
                    diameter="16"
                    class="song-detail__spinner"
                    color="accent"
                  ></mat-spinner>
                  <mat-icon *ngIf="!submitting()" class="song-detail__action-icon">save</mat-icon>
                  <span>{{ 'ACTIONS.SAVE' | translate }}</span>
                </div>
              </button>

              <button
                *ngIf="!isNew && isEditing()"
                mat-stroked-button
                type="button"
                (click)="cancelEdit()"
                class="song-detail__action-button"
                [disabled]="submitting()"
              >
                <mat-icon class="song-detail__action-icon">close</mat-icon>
                {{ 'ACTIONS.CANCEL' | translate }}
              </button>
            </ng-container>

            <button
              *ngIf="!isNew && !isEditing()"
              mat-stroked-button
              color="warn"
              type="button"
              (click)="deleteSong()"
              class="song-detail__action-button"
              [disabled]="submitting()"
            >
              <div class="song-detail__button-content">
                <mat-spinner
                  *ngIf="submitting()"
                  diameter="16"
                  class="song-detail__spinner"
                  color="accent"
                ></mat-spinner>
                <mat-icon *ngIf="!submitting()" class="song-detail__action-icon">delete</mat-icon>
                <span>{{ 'ACTIONS.DELETE' | translate }}</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </app-content>
  `,
  styles: `
    .song-detail {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;

      &__loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        gap: 1rem;
      }

      &__form {
        display: flex;
        flex-direction: column;
        max-width: 800px;
        margin: 0 auto;

        &--disabled {
          opacity: 0.7;
          pointer-events: none;
        }
      }

      &__field {
        margin-bottom: 1rem;
        width: 100%;
      }

      &__label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
      }

      &__chips-container {
        border: 1px solid rgba(0, 0, 0, 0.23);
        border-radius: 4px;
        padding: 0.5rem;
        min-height: 56px;
        background-color: white;
      }

      &__chips-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      &__chip {
        display: inline-flex;
        align-items: center;
        background-color: #e0e0e0;
        border-radius: 16px;
        padding: 0 12px;
        height: 32px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.87);
      }

      &__chip-remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-left: 8px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.26);
        color: rgba(0, 0, 0, 0.54);
        border: none;
        cursor: pointer;
        padding: 0;
        font-size: 18px;
        line-height: 1;
        transition: background-color 0.2s;

        &:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          line-height: 18px;
        }
      }

      &__chip-input-container {
        margin-top: 0.5rem;
      }

      &__chip-input {
        width: 100%;
        border: none;
        outline: none;
        font-size: 14px;
        padding: 0;
        background: transparent;
      }

      &__actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      &__action-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 120px;
        justify-content: center;

        &--save {
          min-width: 140px;
        }
      }

      &__button-content {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
        width: 100%;
      }

      &__action-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
      }

      &__image-preview {
        margin-bottom: 2rem;
        display: flex;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        aspect-ratio: 3/2;
        margin-left: auto;
        margin-right: auto;
      }

      &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &__spinner {
        margin: 0;
      }
    }
  `,
})
export class SongDetailPage implements OnInit, OnDestroy {
  private songFacade = inject(SongFacade);
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private liveAnnouncer = inject(LiveAnnouncer);
  private dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();

  song = signal<Song | undefined>(undefined);
  artist = signal<Artist | undefined>(undefined);
  genres: string[] = [];
  isNew = false;
  loading = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);

  isEditing = signal(false);

  songForm!: FormGroup;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly addOnBlur = true;

  readonly artists = this.songFacade.artists;
  readonly companies = this.songFacade.companies;

  get posterControl() {
    return this.songForm.get('poster')!;
  }
  get titleControl() {
    return this.songForm.get('title')!;
  }
  get artistIdControl() {
    return this.songForm.get('artistId')!;
  }
  get yearControl() {
    return this.songForm.get('year')!;
  }
  get ratingControl() {
    return this.songForm.get('rating')!;
  }
  get durationControl() {
    return this.songForm.get('duration')!;
  }

  ngOnInit(): void {
    this.initForm();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const songId = params['id'];

      if (songId === 'new') {
        this.isNew = true;
        this.songForm.patchValue({
          poster: this.getDefaultPosterUrl(),
        });
        this.enableEditing();
      } else {
        this.loadSong(Number(songId));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.songForm = this.fb.group({
      poster: [''],
      title: ['', Validators.required],
      artistId: [null, Validators.required],
      year: [
        null,
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
      ],
      rating: [null, [Validators.min(0), Validators.max(10)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      companies: [[]],
      genres: [[], Validators.required],
    });

    if (!this.isEditing()) {
      this.songForm.disable();
    }
  }

  private loadSong(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.songFacade
      .getSongById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: { song: Song; artist: Artist | undefined; relatedCompanies: Company[] }) => {
          if (!data.song) {
            console.error('[SongDetailPage] loadSong: No se encontró la canción');
            this.error.set(this.translateService.instant('ERRORS.SONG_NOT_FOUND'));
            this.loading.set(false);
            return;
          }

          this.song.set(data.song);
          this.artist.set(data.artist);
          this.genres = [...(data.song.genre || [])];

          this.updateFormWithSongData(data.song, data.relatedCompanies);

          this.loading.set(false);
        },
        error: (error: Error) => {
          this.error.set(this.translateService.instant('ERRORS.LOADING_SONG'));
          this.loading.set(false);
        },
      });
  }

  private updateFormWithSongData(song: Song, relatedCompanies: Company[]): void {
    const artistId = song.artistId ? parseInt(String(song.artistId), 10) : null;

    let yearDate = null;
    if (song.year) {
      const year = typeof song.year === 'string' ? parseInt(song.year, 10) : song.year;
      if (!isNaN(year)) {
        yearDate = new Date(year, 0, 1);
      }
    }

    this.songForm.patchValue({
      poster: song.poster || '',
      title: song.title || '',
      artistId: artistId,
      year: yearDate,
      rating: song.rating || null,
      duration: song.duration || null,
      companies: relatedCompanies.map((company) => company.id),
      genres: song.genre || [],
    });

    if (!this.isEditing()) {
      this.songForm.disable();
    }
  }

  enableEditing(): void {
    this.isEditing.set(true);
    this.songForm.enable();

    const currentValue = this.songForm.value;
    this.songForm.patchValue(currentValue);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.songForm.disable();

    if (this.song()) {
      const currentSong = this.song();
      const year = currentSong?.year;

      let yearDate = null;
      if (year) {
        const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
        if (!isNaN(yearNum)) {
          yearDate = new Date(yearNum, 0, 1);
        }
      }

      this.songForm.patchValue({
        poster: currentSong?.poster,
        title: currentSong?.title,
        artistId: currentSong?.artistId,
        year: yearDate,
        rating: currentSong?.rating,
        duration: currentSong?.duration,
        genres: currentSong?.genre || [],
      });
      this.genres = [...(currentSong?.genre || [])];
    }
  }

  saveChanges(): void {
    if (this.songForm.valid) {
      console.log(
        '[SongDetailPage] saveChanges: Enviando formulario con valores:',
        this.songForm.value,
      );
      const formValue = this.songForm.value;

      const year = formValue.year ? formValue.year.getFullYear() : null;

      const songData: Partial<Song> = {
        id: this.song()?.id,
        title: formValue.title,
        artistId: formValue.artistId,
        year,
        duration: formValue.duration,
        genre: formValue.genres,
        rating: formValue.rating,
        poster: formValue.poster,
      };

      this.submitting.set(true);
      this.songForm.disable();

      this.songFacade
        .saveSong(songData, formValue.artistId, formValue.companies)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.submitting.set(false);
            if (this.isEditing()) {
              this.songForm.enable();
            }
          }),
        )
        .subscribe({
          next: (savedSong: Song) => {
            this.router.navigate(['/songs']);
          },
          error: (error: Error) => {
            this.error.set(this.translateService.instant('ERRORS.SAVING_SONG'));
          },
        });
    } else {
      this.error.set(this.translateService.instant('ERRORS.INVALID_FORM'));
    }
  }

  async deleteSong(): Promise<void> {
    console.log('[SongDetailPage] Iniciando proceso de eliminación de canción');
    const currentSong = this.song();
    if (!currentSong) {
      console.warn('[SongDetailPage] No hay canción para eliminar');
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        title: this.translateService.instant('DIALOGS.DELETE_SONG.TITLE'),
        message: this.translateService.instant('DIALOGS.DELETE_SONG.MESSAGE'),
        confirmText: this.translateService.instant('DIALOGS.DELETE_CONFIRM'),
        cancelText: this.translateService.instant('DIALOGS.DELETE_CANCEL'),
        isError: true,
      },
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());

    if (!confirmed) {
      console.log('[SongDetailPage] Eliminación cancelada por el usuario');
      return;
    }

    this.submitting.set(true);

    this.songFacade
      .deleteSong(currentSong.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          console.log('[SongDetailPage] Finalizando proceso de eliminación');
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: () => {
          console.log('[SongDetailPage] Canción eliminada exitosamente');
          this.router.navigate(['/songs']);
        },
        error: (error: Error) => {
          console.error('[SongDetailPage] Error al eliminar la canción:', error);
          this.error.set(this.translateService.instant('ERRORS.DELETING_SONG'));
        },
      });
  }

  onYearSelected(date: Date): void {
    this.yearControl.setValue(date);
  }

  addGenre(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.genres.includes(value)) {
      this.genres.push(value);
      this.songForm.patchValue({ genres: this.genres });
    }

    event.chipInput!.clear();
  }

  editGenre(genre: string, event: MatChipEditedEvent): void {
    const index = this.genres.indexOf(genre);
    const value = event.value.trim();

    if (index >= 0) {
      if (value) {
        this.genres[index] = value;
      } else {
        this.removeGenre(genre);
      }
      this.songForm.patchValue({ genres: this.genres });
    }
  }

  removeGenre(genre: string): void {
    const index = this.genres.indexOf(genre);
    if (index >= 0) {
      this.genres.splice(index, 1);
      this.liveAnnouncer.announce(`Removed ${genre}`);
      this.songForm.patchValue({ genres: this.genres });
    }
  }

  goBack(): void {
    this.router.navigate(['/songs']);
  }

  private getDefaultPosterUrl(): string {
    return 'http://dummyimage.com/400x600.png/cc0000/ffffff';
  }

  @Memo
  getPlaceholderUrl(): string {
    const imageUnavailableText = this.translateService.instant('SONGS.IMAGE_UNAVAILABLE');
    return imageUnavailableText;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getPlaceholderUrl();
  }
}
