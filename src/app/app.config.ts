import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { provideMenuResource } from './resources/menu.resource';
import { provideRouteResource } from './resources/route.resource';
import { provideSongResource } from './resources/song.resource';
import { provideArtistResource } from './resources/artist.resource';
import { provideCompanyResource } from './resources/company.resource';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { provideTranslationResource } from './resources/translation.resource';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppErrorHandlerService } from './core/error/error-handler.service';
import { ErrorInterceptor } from './core/http/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(MatDialogModule),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
        isolate: false,
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, 'assets/i18n/', '.json'),
          deps: [HttpClient],
        },
      }),
    ),

    {
      provide: ErrorHandler,
      useClass: AppErrorHandlerService,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },

    provideMenuResource(),
    provideRouteResource(),
    provideSongResource(),
    provideArtistResource(),
    provideCompanyResource(),
    provideTranslationResource(),
  ],
};
