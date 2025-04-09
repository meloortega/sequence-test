import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MENU_RESOURCE } from './resources/menu.resource';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true },
    ),
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    group([
      query(':leave', [animate('200ms ease-out', style({ opacity: 0 }))], { optional: true }),
      query(':enter', [style({ opacity: 0 }), animate('400ms ease-out', style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
  ]),
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatSidenavModule, SidenavComponent],
  animations: [fadeAnimation],
  template: `
    <mat-sidenav-container class="app">
      <mat-sidenav
        mode="over"
        [opened]="menu.isMenuOpen()"
        (closed)="menu.closeMenu()"
        autoFocus="false"
      >
        <app-sidenav />
      </mat-sidenav>

      <mat-sidenav-content autoFocus="false">
        <div [@fadeAnimation]="getRouterOutletState(o)">
          <router-outlet #o="outlet"></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .app {
      height: 100vh;
    }
  `,
})
export class AppComponent {
  readonly menu = inject(MENU_RESOURCE);
  readonly router = inject(Router);

  constructor(private translate: TranslateService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.menu.closeMenu());
  }

  getRouterOutletState(outlet: RouterOutlet) {
    return outlet && outlet.isActivated ? outlet.activatedRoute : '';
  }
}
