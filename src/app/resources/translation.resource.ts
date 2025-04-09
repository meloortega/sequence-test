import { InjectionToken, inject, signal, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export type Language = 'en' | 'es' | 'fr';

export interface TranslationResource {
  currentLanguage: Signal<Language>;
  supportedLanguages: Language[];
  setLanguage: (lang: Language) => void;
  translate: (key: string, params?: object) => string;
  translateAsync: (key: string, params?: object) => Observable<string>;
}

export const TRANSLATION_RESOURCE = new InjectionToken<TranslationResource>('TranslationResource');

function isSupportedLanguage(lang: string, supportedLangs: Language[]): lang is Language {
  return supportedLangs.includes(lang as Language);
}

// Get initial language
function getInitialLanguage(supportedLangs: Language[]): Language {
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang && isSupportedLanguage(savedLang, supportedLangs)) {
    return savedLang;
  }

  const browserLang = navigator.language.split('-')[0] as Language;
  return isSupportedLanguage(browserLang, supportedLangs) ? browserLang : 'en';
}

export const provideTranslationResource = () => {
  const supportedLanguages: Language[] = ['en', 'es', 'fr'];

  return {
    provide: TRANSLATION_RESOURCE,
    useFactory: () => {
      const translate = inject(TranslateService);
      console.log('Inicializando TranslationResource');

      if (!translate.getLangs().length) {
        console.warn(
          'TranslateService no tiene idiomas configurados. Añadiendo configuración básica.',
        );
        translate.addLangs(supportedLanguages);
        translate.setDefaultLang('en');
      }

      const initialLang = getInitialLanguage(supportedLanguages);
      console.log('Idioma inicial:', initialLang);

      const currentLanguageSignal = signal<Language>(initialLang);

      translate.use(initialLang);
      localStorage.setItem('language', initialLang);

      translate.onLangChange.subscribe((event) => {
        const newLang = event.lang as Language;
        if (
          isSupportedLanguage(newLang, supportedLanguages) &&
          currentLanguageSignal() !== newLang
        ) {
          console.log(
            `TranslationResource: Sincronizando idioma desde TranslateService a ${newLang}`,
          );
          currentLanguageSignal.set(newLang);
          localStorage.setItem('language', newLang);
        }
      });

      const setLanguage = (lang: Language): void => {
        if (isSupportedLanguage(lang, supportedLanguages) && currentLanguageSignal() !== lang) {
          console.log(`TranslationResource: Cambiando idioma a ${lang}`);

          /**
           * IMPORTANT: This service acts as a wrapper over TranslateService so
           * we must update that service first. Weird design, I know :3
           */
          translate.use(lang);
        }
      };

      const translateText = (key: string, params?: object): string => {
        return translate.instant(key, params);
      };

      const translateTextAsync = (key: string, params?: object): Observable<string> => {
        return translate.get(key, params);
      };

      return {
        currentLanguage: currentLanguageSignal.asReadonly(),
        supportedLanguages,
        setLanguage,
        translate: translateText,
        translateAsync: translateTextAsync,
      };
    },
  };
};
