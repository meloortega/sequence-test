import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { MENU_RESOURCE } from '../../resources/menu.resource';
import { ROUTE_RESOURCE } from '../../resources/route.resource';
import { TRANSLATION_RESOURCE } from '../../resources/translation.resource';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { signal } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';

// Add type declaration for Jasmine
declare const expect: any;

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let menuResource: any;
  let routeResource: any;
  let translateService: any;
  let translationResource: any;

  beforeEach(async () => {
    menuResource = {
      toggleMenu: jasmine.createSpy('toggleMenu'),
      closeMenu: jasmine.createSpy('closeMenu'),
    };

    routeResource = {
      currentRoute: signal('/songs'),
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

    translationResource = {
      currentLanguage: signal('en'),
      supportedLanguages: ['en', 'es', 'fr'],
      setLanguage: jasmine.createSpy('setLanguage'),
      translate: jasmine.createSpy('translate').and.returnValue('Translated Text'),
      translateAsync: jasmine.createSpy('translateAsync').and.returnValue(of('Translated Text')),
    };

    await TestBed.configureTestingModule({
      imports: [
        SidenavComponent,
        RouterTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        LanguageSelectorComponent,
      ],
      providers: [
        { provide: MENU_RESOURCE, useValue: menuResource },
        { provide: ROUTE_RESOURCE, useValue: routeResource },
        { provide: TranslateService, useValue: translateService },
        { provide: TRANSLATION_RESOURCE, useValue: translationResource },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close menu when clicking on a navigation link', () => {
    const link = fixture.nativeElement.querySelector('a[routerLink="/songs"]');
    link.click();
    expect(menuResource.closeMenu).toHaveBeenCalled();
  });

  it('should toggle menu when clicking close button', () => {
    const closeButton = fixture.nativeElement.querySelector('.sidenav__close-button');
    closeButton.click();
    expect(menuResource.toggleMenu).toHaveBeenCalled();
  });

  it('should highlight active route', () => {
    routeResource.currentRoute = signal('/songs');
    fixture.detectChanges();

    const menuItems = Array.from(
      fixture.nativeElement.querySelectorAll('a.sidenav__link'),
    ) as HTMLElement[];
    const songsLink = menuItems.find((item) => item.getAttribute('routerLink') === '/songs');

    expect(songsLink?.classList.contains('sidenav__link--active')).toBeTrue();
  });

  it('should not highlight inactive route', () => {
    routeResource.currentRoute = signal('/artists');
    fixture.detectChanges();

    const menuItems = Array.from(
      fixture.nativeElement.querySelectorAll('a.sidenav__link'),
    ) as HTMLElement[];
    const songsLink = menuItems.find((item) => item.getAttribute('routerLink') === '/songs');

    expect(songsLink?.classList.contains('sidenav__link--active')).toBeFalse();
  });

  it('should contain language selector component', () => {
    const languageSelector = fixture.nativeElement.querySelector('app-language-selector');
    expect(languageSelector).toBeTruthy();
  });
});
