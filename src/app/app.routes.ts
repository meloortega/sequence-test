import { Routes } from '@angular/router';
import { SongsPage } from './pages/songs/songs.page';
import { NotFoundPage } from './pages/not-found/not_found.page';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full',
  },
  {
    path: 'songs',
    component: SongsPage,
    providers: [importProvidersFrom(MatDialogModule)],
  },
  {
    path: 'songs/:id',
    loadComponent: () => import('./pages/songs/song-detail.page').then((m) => m.SongDetailPage),
    providers: [importProvidersFrom(MatDialogModule)],
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
