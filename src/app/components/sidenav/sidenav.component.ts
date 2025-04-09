import { Component, inject } from '@angular/core';
import { MENU_RESOURCE } from '../../resources/menu.resource';
import { ROUTE_RESOURCE } from '../../resources/route.resource';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    TranslateModule,
    LanguageSelectorComponent,
  ],
  template: `
    <mat-toolbar class="sidenav__toolbar">
      <app-language-selector class="sidenav__language-selector"></app-language-selector>
      <span class="sidenav__spacer"></span>
      <button
        mat-icon-button
        class="sidenav__close-button"
        (click)="menu.toggleMenu()"
        [attr.aria-label]="'GENERAL.CANCEL' | translate"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-toolbar>

    <nav class="sidenav__nav">
      <a
        class="sidenav__link"
        routerLink="/songs"
        (click)="menu.closeMenu()"
        [ngClass]="{ 'sidenav__link--active': route.currentRoute().startsWith('/songs') }"
      >
        {{ 'MENU.SONGS' | translate }}
      </a>

      <a
        class="sidenav__link"
        routerLink="/artists"
        (click)="menu.closeMenu()"
        [ngClass]="{ 'sidenav__link--active': route.currentRoute().startsWith('/artists') }"
      >
        {{ 'MENU.ARTISTS' | translate }}
      </a>

      <a
        class="sidenav__link"
        routerLink="/companies"
        (click)="menu.closeMenu()"
        [ngClass]="{ 'sidenav__link--active': route.currentRoute().startsWith('/companies') }"
      >
        {{ 'MENU.COMPANIES' | translate }}
      </a>
    </nav>
  `,
  styles: `
    .sidenav {
      &__toolbar {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 1rem;
      }

      &__spacer {
        flex: 1;
      }

      &__language-selector {
        margin-right: 8px;
      }

      &__close-button {
        color: #4b5563;
        transition: color 0.2s;

        &:hover {
          color: #000;
        }
      }

      &__nav {
        display: flex;
        flex-direction: column;
        padding: 0 1rem;
        gap: 0.5rem;
      }

      &__link {
        display: block;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        text-decoration: none;
        color: inherit;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f3f4f6;
        }

        &--active {
          background-color: #e5e7eb;
          font-weight: 600;
        }
      }
    }
  `,
})
export class SidenavComponent {
  readonly menu = inject(MENU_RESOURCE);
  readonly route = inject(ROUTE_RESOURCE);
}
