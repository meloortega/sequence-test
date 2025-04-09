import { Component, inject } from '@angular/core';
import { MENU_RESOURCE } from '../../resources/menu.resource';
import { HeaderComponent } from '../../components/header/header.component';
import { ContentComponent } from '../../components/content/content.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [HeaderComponent, ContentComponent, TranslateModule],
  template: `
    <app-header [showMenu]="true" (onMenuClick)="menu.toggleMenu()" />
    <app-content>
      <div class="coming-soon">
        <i class="fas fa-tools icon"></i>
        <h1>{{ 'ERRORS.NOT_FOUND.TITLE' | translate }}</h1>
        <p>{{ 'ERRORS.NOT_FOUND.MESSAGE' | translate }}</p>
        <p class="subtitle">{{ 'ERRORS.NOT_FOUND.SUBTITLE' | translate }}</p>
      </div>
    </app-content>
  `,
  styles: `
    .coming-soon {
      text-align: center;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .icon {
      font-size: 5rem;
      color: #3498db;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 3.5rem;
      margin: 0;
      color: #2c3e50;
      font-weight: 700;
    }

    p {
      font-size: 1.5rem;
      margin: 0.5rem 0;
      color: #34495e;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #7f8c8d;
    }
  `,
})
export class NotFoundPage {
  readonly menu = inject(MENU_RESOURCE);
}
