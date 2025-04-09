import { Injectable, inject, signal, effect } from '@angular/core';
import { SONG_RESOURCE } from '../../resources/song.resource';
import { ARTIST_RESOURCE } from '../../resources/artist.resource';
import { COMPANY_RESOURCE } from '../../resources/company.resource';
import { Song } from '../../models/song.model';
import { Artist } from '../../models/artist.model';
import { Company } from '../../models/company.model';
import { Observable, catchError, forkJoin, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class SongFacade {
  private songResource = inject(SONG_RESOURCE);
  private artistResource = inject(ARTIST_RESOURCE);
  private companyResource = inject(COMPANY_RESOURCE);
  private notificationService = inject(NotificationService);

  readonly songs = this.songResource.getAll();
  readonly artists = this.artistResource.getAll();
  readonly companies = this.companyResource.getAll();

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const songs = this.songs();
      const artists = this.artists();

      console.log('[SongFacade] Songs actualizados:', songs?.length || 0);
      console.log('[SongFacade] Artists actualizados:', artists?.length || 0);

      if (songs && songs.length > 0) {
        console.log(
          '[SongFacade] IDs de artistas en canciones:',
          songs.map((s) => s.artistId).filter((id) => id !== undefined),
        );
      }

      if (artists && artists.length > 0) {
        console.log(
          '[SongFacade] IDs de artistas disponibles:',
          artists.map((a) => a.id),
        );
      }
    });
  }

  getSongById(id: number): Observable<{
    song: Song;
    artist: Artist | undefined;
    relatedCompanies: Company[];
  }> {
    this.loading.set(true);
    this.error.set(null);

    return from(this.songResource.getById(id)).pipe(
      switchMap((song) => {
        if (!song) {
          return throwError(() => new Error('Song not found'));
        }

        // Get the artist and companies in parallel
        return forkJoin({
          song: of(song),
          artist: from(this.artistResource.getById(song.artistId ?? -1)),
          companies: of(this.companyResource.getAll()()),
        }).pipe(
          map(({ song, artist, companies }) => {
            const relatedCompanies = companies.filter(
              (company) => company.songs && company.songs.includes(song.id),
            );

            return {
              song,
              artist,
              relatedCompanies,
            };
          }),
        );
      }),
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(this.getErrorMessage(err));
        return throwError(() => err);
      }),
    );
  }

  saveSong(songData: Partial<Song>, artistId: number, companyIds: number[]): Observable<Song> {
    this.loading.set(true);
    this.error.set(null);

    const isNewSong = !songData.id;

    const songToSave: Partial<Song> = {
      ...songData,
      artistId,
    };

    const saveOperation = songData.id
      ? this.songResource.update(songData.id, songToSave)
      : this.songResource.create(songToSave);

    return from(saveOperation).pipe(
      switchMap((savedSong) => {
        return this.updateCompanyRelationships(savedSong.id, companyIds).pipe(map(() => savedSong));
      }),
      tap(() => {
        this.loading.set(false);
        if (isNewSong) {
          this.notificationService.success('NOTIFICATIONS.SONG_CREATED');
        } else {
          this.notificationService.success('NOTIFICATIONS.SONG_UPDATED');
        }
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(this.getErrorMessage(err));
        if (isNewSong) {
          this.notificationService.error('NOTIFICATIONS.ERROR_CREATING');
        } else {
          this.notificationService.error('NOTIFICATIONS.ERROR_UPDATING');
        }
        return throwError(() => err);
      }),
    );
  }

  deleteSong(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return from(this.songResource.delete(id)).pipe(
      tap(() => {
        this.loading.set(false);
        this.notificationService.success('NOTIFICATIONS.SONG_DELETED');
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(this.getErrorMessage(err));
        this.notificationService.error('NOTIFICATIONS.ERROR_DELETING');
        return throwError(() => err);
      }),
    );
  }

  private updateCompanyRelationships(songId: number, companyIds: number[]): Observable<void> {
    const companies = this.companyResource.getAll()();
    if (!companies || companies.length === 0) {
      return of(void 0);
    }

    const updates: Promise<Company>[] = [];

    companies.forEach((company) => {
      const hasSong = company.songs && company.songs.includes(songId);
      const shouldHaveSong = companyIds.includes(company.id);

      if (hasSong !== shouldHaveSong) {
        const updatedSongs = [...(company.songs || [])];
        if (shouldHaveSong) {
          updatedSongs.push(songId);
        } else {
          const index = updatedSongs.indexOf(songId);
          if (index !== -1) {
            updatedSongs.splice(index, 1);
          }
        }

        updates.push(
          this.companyResource.update(company.id, {
            ...company,
            songs: updatedSongs,
          }),
        );
      }
    });

    if (updates.length === 0) {
      return of(void 0);
    }

    return from(Promise.all(updates)).pipe(map(() => void 0));
  }

  private getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || error.message || 'ERRORS.DEFAULT';
    }
    return error?.message || 'ERRORS.DEFAULT';
  }
}
