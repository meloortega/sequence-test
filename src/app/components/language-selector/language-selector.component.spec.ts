import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent } from './language-selector.component';
import { TRANSLATION_RESOURCE } from '../../resources/translation.resource';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';

// Add type declaration for Jasmine
declare const expect: any;

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let translationResource: any;
  let translateService: any;

  beforeEach(async () => {
    translationResource = {
      currentLanguage: signal('en'),
      supportedLanguages: ['en', 'es', 'fr'],
      setLanguage: jasmine.createSpy('setLanguage'),
      translate: jasmine.createSpy('translate').and.returnValue('Translated Text'),
      translateAsync: jasmine.createSpy('translateAsync').and.returnValue(of('Translated Text')),
    };

    const currentLang = new BehaviorSubject('en');

    translateService = {
      setDefaultLang: jasmine.createSpy('setDefaultLang'),
      use: jasmine.createSpy('use'),
      get: jasmine.createSpy('get').and.returnValue(of('Translated Text')),
      instant: jasmine.createSpy('instant').and.returnValue('Translated Text'),
      onLangChange: of({ lang: 'en' }),
      addLangs: jasmine.createSpy('addLangs'),
      getLangs: jasmine.createSpy('getLangs').and.returnValue(['en', 'es', 'fr']),
      currentLang: currentLang,
      onTranslationChange: of({}),
      onDefaultLangChange: of({}),
      stream: jasmine.createSpy('stream').and.returnValue(of('Translated Text')),
      getBrowserLang: jasmine.createSpy('getBrowserLang').and.returnValue('en'),
      getBrowserCultureLang: jasmine.createSpy('getBrowserCultureLang').and.returnValue('en-US'),
      setTranslation: jasmine.createSpy('setTranslation'),
      addTranslation: jasmine.createSpy('addTranslation'),
      getTranslation: jasmine.createSpy('getTranslation').and.returnValue(of({})),
      reloadLang: jasmine.createSpy('reloadLang').and.returnValue(of({})),
      resetLang: jasmine.createSpy('resetLang'),
      getDefaultLang: jasmine.createSpy('getDefaultLang').and.returnValue('en'),
      getParsedResult: jasmine.createSpy('getParsedResult').and.returnValue({}),
    };

    await TestBed.configureTestingModule({
      imports: [
        LanguageSelectorComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
      ],
      providers: [
        { provide: TRANSLATION_RESOURCE, useValue: translationResource },
        { provide: TranslateService, useValue: translateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all language options', () => {
    expect(component.languages.length).toBe(3);
    expect(component.languages[0].code).toBe('en');
    expect(component.languages[1].code).toBe('es');
    expect(component.languages[2].code).toBe('fr');
  });

  it('should call setLanguage when selecting a language', () => {
    const languageCode = 'es';
    component.setLanguage(languageCode);
    expect(translationResource.setLanguage).toHaveBeenCalledWith(languageCode);
  });

  it('should have correct language options with flags', () => {
    expect(component.languages[0].code).toBe('en');
    expect(component.languages[0].flag).toBe('🇬🇧');
    expect(component.languages[1].code).toBe('es');
    expect(component.languages[1].flag).toBe('🇪🇸');
    expect(component.languages[2].code).toBe('fr');
    expect(component.languages[2].flag).toBe('🇫🇷');
  });

  it('should have correct name keys for translation', () => {
    expect(component.languages[0].nameKey).toBe('LANGUAGE.ENGLISH');
    expect(component.languages[1].nameKey).toBe('LANGUAGE.SPANISH');
    expect(component.languages[2].nameKey).toBe('LANGUAGE.FRENCH');
  });

  it('should use the translation resource for current language', () => {
    expect(component.translation).toBe(translationResource);
  });
});
