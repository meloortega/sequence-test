import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { TRANSLATION_RESOURCE } from './resources/translation.resource';
import { MENU_RESOURCE } from './resources/menu.resource';
import { ROUTE_RESOURCE } from './resources/route.resource';
import { signal } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

// Add type declaration for Jasmine
declare const expect: any;
declare const spyOn: any;

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translateService: any;
  let translationResource: any;
  let menuResource: any;
  let routeResource: any;
  let router: Router;

  beforeEach(async () => {
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

    translationResource = {
      currentLanguage: signal('en'),
      supportedLanguages: ['en', 'es', 'fr'],
      setLanguage: jasmine.createSpy('setLanguage'),
      translate: jasmine.createSpy('translate').and.returnValue('Translated Text'),
      translateAsync: jasmine.createSpy('translateAsync').and.returnValue(of('Translated Text')),
    };

    menuResource = {
      isMenuOpen: jasmine.createSpy('isMenuOpen').and.returnValue(false),
      closeMenu: jasmine.createSpy('closeMenu'),
    };

    routeResource = {
      currentRoute: signal('/songs'),
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        SidenavComponent,
        LanguageSelectorComponent,
      ],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: TRANSLATION_RESOURCE, useValue: translationResource },
        { provide: MENU_RESOURCE, useValue: menuResource },
        { provide: ROUTE_RESOURCE, useValue: routeResource },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close menu on navigation', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    menuResource.closeMenu();
    expect(menuResource.closeMenu).toHaveBeenCalled();
  });
});
