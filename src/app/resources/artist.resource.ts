import { Artist } from '../models/artist.model';
import { createResource } from '../core/factories/resource-api.factory';
import { InjectionToken } from '@angular/core';
import { Resource } from '../core/factories/resource-api.factory';

export const ARTIST_RESOURCE = new InjectionToken<Resource<Artist>>('ArtistResource');

export const provideArtistResource = () => createResource<Artist>(ARTIST_RESOURCE, '/artists');
