import { InjectionToken } from '@angular/core';
import { createResource } from '../core/factories/resource-api.factory';
import { Song } from '../models/song.model';
import { Resource } from '../core/factories/resource-api.factory';

export const SONG_RESOURCE = new InjectionToken<Resource<Song>>('SongResource');

export const provideSongResource = () => createResource<Song>(SONG_RESOURCE, '/songs');
