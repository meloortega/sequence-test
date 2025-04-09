import { Component, input, output, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TranslateModule,
  ],
  animations: [
    trigger('searchMode', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          position: 'relative',
        }),
        animate(
          '100ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
            position: 'relative',
          }),
        ),
      ]),
    ]),
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          position: 'relative',
          zIndex: 1,
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
            position: 'relative',
            zIndex: 1,
          }),
        ),
      ]),
    ]),
  ],
  template: `
    <mat-toolbar class="header" [class.header--search-mode]="searchModeActive()">
      <div class="header__container">
        <!-- Modo búsqueda activa (mobile) -->
        <ng-container *ngIf="searchModeActive()">
          <div class="header__content" @searchMode>
            <mat-form-field appearance="outline" class="header__search-field-mobile">
              <input
                matInput
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="updateSearchQuery($event)"
                [placeholder]="searchPlaceholder() | translate"
                #searchInput
              />
              <button
                mat-icon-button
                matSuffix
                (click)="closeSearchMode()"
                [attr.aria-label]="'GENERAL.SEARCH' | translate"
              >
                <mat-icon>search</mat-icon>
              </button>
            </mat-form-field>
          </div>
        </ng-container>

        <!-- Modo normal -->
        <ng-container *ngIf="!searchModeActive()">
          <div class="header__content" @fadeSlideIn>
            <!-- Slot izquierdo: Botón de menú o back -->
            <div class="header__slot header__slot--left">
              <ng-container *ngIf="showMenu()">
                <button
                  mat-icon-button
                  class="header__button"
                  [attr.aria-label]="'MENU.TITLE' | translate"
                  (click)="toggleMenu()"
                >
                  <mat-icon>menu</mat-icon>
                </button>
              </ng-container>

              <ng-container *ngIf="showBackButton()">
                <button
                  mat-icon-button
                  class="header__button"
                  [attr.aria-label]="'COMMON.BACK' | translate"
                  (click)="goBack()"
                >
                  <mat-icon>arrow_back</mat-icon>
                </button>
              </ng-container>
            </div>

            <!-- Slot central: Título -->
            <div class="header__slot header__slot--center">
              <span class="header__title">
                <ng-container *ngIf="translationsLoaded() || !isTranslationKey(title())">
                  {{ isTranslationKey(title()) ? (title() | translate) : title() }}
                </ng-container>
                <ng-container *ngIf="!translationsLoaded() && isTranslationKey(title())">
                  <span class="header__title-placeholder"></span>
                </ng-container>
              </span>
            </div>

            <!-- Slot derecho: Búsqueda -->
            <div class="header__slot header__slot--right">
              <!-- Botón de búsqueda para móvil -->
              <button
                mat-icon-button
                class="header__button header__search-button"
                [attr.aria-label]="'GENERAL.SEARCH' | translate"
                (click)="toggleSearchMode()"
                *ngIf="showSearch() && isMobile()"
              >
                <mat-icon>search</mat-icon>
              </button>

              <!-- Campo de búsqueda para escritorio -->
              <div
                class="header__search header__search--desktop"
                *ngIf="showSearch() && !isMobile()"
              >
                <mat-form-field appearance="outline" class="header__search-field">
                  <input
                    matInput
                    type="text"
                    [ngModel]="searchQuery()"
                    (ngModelChange)="updateSearchQuery($event)"
                    [placeholder]="searchPlaceholder() | translate"
                  />
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </mat-toolbar>
  `,
  styles: `
    .header {
      padding: 0;
      display: block;
      margin-top: 8px;
      width: 100%;
      box-sizing: border-box;

      &__container {
        max-width: 1120px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
        width: 100%;
        box-sizing: border-box;
        position: relative;
      }

      &__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      &__slot {
        display: flex;
        align-items: center;

        &--left {
          margin-right: 1rem;
          flex: 0 0 auto;
          min-width: 48px;
        }

        &--center {
          flex: 1;
          display: flex;
          justify-content: center;
          text-align: center;
          min-width: 0;
          overflow: hidden;
        }

        &--right {
          margin-left: 1rem;
          flex: 0 0 auto;
          min-width: 48px;
          display: flex;
          justify-content: flex-end;
        }
      }

      &__title {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        text-align: center;
        display: block;
        width: 100%;
      }

      &__title-placeholder {
        display: inline-block;
        width: 100px;
        height: 1.25rem;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }

      &__button {
        margin-right: 0.5rem;

        &:last-child {
          margin-right: 0;
        }
      }

      &__search {
        display: none;

        @media (min-width: 768px) {
          display: block;
          width: 300px;
        }

        &--desktop {
          .header__search-field {
            width: 100%;
          }
        }
      }

      &__search-field {
        width: 100%;
        margin-bottom: 0;

        ::ng-deep .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }

      &__search-field-mobile {
        width: 100%;
        margin-bottom: 0;
      }
    }
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  private isMobileScreen = signal<boolean>(false);
  private resizeListener: () => void;

  title = input<string>('');
  titleAlignment = input<'left' | 'center'>('left');
  translationsLoaded = signal<boolean>(false);

  constructor() {
    // Here we set the mobile screen state, then we add a listener to the window resize event
    this.isMobileScreen.set(window.innerWidth < 768);

    this.resizeListener = () => {
      this.isMobileScreen.set(window.innerWidth < 768);
    };

    window.addEventListener('resize', this.resizeListener);
  }

  ngOnInit(): void {
    /**
     * Here we subscribe to the event of loading translations,
     * then we set the translationsLoaded signal to true and we check if the translations are loaded
     * then we subscribe to the event of loading default language and finally we check if the translations are loaded.
     *
     * TODO: I'm sure there's a better way to do this, but it works for now.
     */
    this.translateService.onLangChange.subscribe(() => {
      this.translationsLoaded.set(true);
    });

    if (this.translateService.currentLang) {
      this.translationsLoaded.set(true);
    }

    this.translateService.onDefaultLangChange.subscribe(() => {
      this.translationsLoaded.set(true);
    });

    setTimeout(() => {
      if (this.translateService.currentLang) {
        this.translationsLoaded.set(true);
      }
    }, 100);

    setTimeout(() => {
      this.translationsLoaded.set(true);
    }, 500);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  isTranslationKey(text: string): boolean {
    return Boolean(text && text.includes('.') && !text.includes(' '));
  }

  get displayTitle(): string {
    // Here we get the title value and we check if the translations are loaded and if the title is a translation key
    const titleValue = this.title();

    if (!this.translationsLoaded() && this.isTranslationKey(titleValue)) {
      return '';
    }

    if (titleValue && this.isTranslationKey(titleValue)) {
      const translated = this.translateService.instant(titleValue);
      if (translated !== titleValue) {
        return translated;
      }
    }

    return titleValue;
  }

  showMenu = input<boolean>(false);
  onMenuClick = output<void>();
  toggleMenu() {
    this.onMenuClick.emit();
  }

  showBackButton = input<boolean>(false);
  backButtonClick = output<void>();
  goBack() {
    this.backButtonClick.emit();
  }

  showSearch = input<boolean>(false);
  searchQuery = input<string>('');
  searchPlaceholder = input<string>('SONGS.SEARCH_PLACEHOLDER');
  onSearchChange = output<string>();

  searchModeActive = signal<boolean>(false);

  toggleSearchMode() {
    this.searchModeActive.set(!this.searchModeActive());
    if (this.searchModeActive()) {
      /**
       * Here we focus the search input after the component is rendered.
       *
       * TODO: Super hacky. Think a better way.
       */
      setTimeout(() => {
        const searchInput = document.querySelector(
          '.header__search-mode input',
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      });
    }
  }

  closeSearchMode() {
    this.searchModeActive.set(false);
  }

  updateSearchQuery(query: string) {
    this.onSearchChange.emit(query);
  }

  isMobile() {
    return this.isMobileScreen();
  }
}
