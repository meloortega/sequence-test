import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Language, TRANSLATION_RESOURCE } from '../../resources/translation.resource';

interface LanguageOption {
  code: Language;
  nameKey: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule, TranslateModule],
  template: `
    <button
      mat-icon-button
      [matMenuTriggerFor]="languageMenu"
      [attr.aria-label]="'LANGUAGE.SELECT' | translate"
      class="language-selector"
    >
      <mat-icon>language</mat-icon>
    </button>

    <mat-menu #languageMenu="matMenu">
      <button
        *ngFor="let lang of languages"
        mat-menu-item
        (click)="setLanguage(lang.code)"
        [class.active]="translation.currentLanguage() === lang.code"
      >
        <span class="language-flag">{{ lang.flag }}</span>
        <span class="language-name">{{ lang.nameKey | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: `
    .language-selector {
      margin-left: 8px;
    }

    .language-flag {
      margin-right: 8px;
      font-size: 1.2rem;
    }

    .language-name {
      font-size: 0.9rem;
    }

    .active {
      font-weight: bold;
      background-color: rgba(0, 0, 0, 0.05);
    }
  `,
})
export class LanguageSelectorComponent {
  translation = inject(TRANSLATION_RESOURCE);

  languages: LanguageOption[] = [
    { code: 'en', nameKey: 'LANGUAGE.ENGLISH', flag: '🇬🇧' },
    { code: 'es', nameKey: 'LANGUAGE.SPANISH', flag: '🇪🇸' },
    { code: 'fr', nameKey: 'LANGUAGE.FRENCH', flag: '🇫🇷' },
  ];

  setLanguage(lang: Language): void {
    this.translation.setLanguage(lang);
  }
}
