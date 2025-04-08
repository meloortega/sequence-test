import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';

export type LoadingState = 'loading' | 'error' | 'empty' | 'success';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('iconState', [
      state(
        'error',
        style({
          transform: 'scale(1)',
        }),
      ),
      state(
        'empty',
        style({
          transform: 'scale(1)',
        }),
      ),
      transition('void => error', [
        animate(
          '600ms ease-out',
          keyframes([
            style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
            style({ transform: 'scale(1.2)', opacity: 1, offset: 0.7 }),
            style({ transform: 'scale(1)', opacity: 1, offset: 1 }),
          ]),
        ),
      ]),
      transition('void => empty', [
        animate(
          '600ms ease-out',
          keyframes([
            style({ transform: 'scale(0) rotate(-90deg)', opacity: 0, offset: 0 }),
            style({ transform: 'scale(1.1) rotate(5deg)', opacity: 1, offset: 0.7 }),
            style({ transform: 'scale(1) rotate(0)', opacity: 1, offset: 1 }),
          ]),
        ),
      ]),
    ]),
    trigger('buttonAppear', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="loading-container" [ngClass]="'loading-container--' + state" @fadeIn>
      <!-- Loading state -->
      <div *ngIf="state === 'loading'" class="loading-container__spinner">
        <mat-spinner [diameter]="spinnerSize"></mat-spinner>
        <p *ngIf="loadingText" class="loading-container__text">{{ loadingText | translate }}</p>
      </div>

      <!-- Error state -->
      <div *ngIf="state === 'error'" class="loading-container__error">
        <mat-icon
          class="loading-container__icon loading-container__icon--error"
          [@iconState]="'error'"
          >error</mat-icon
        >
        <p class="loading-container__text">{{ errorText | translate }}</p>
        <button
          *ngIf="showRetry"
          mat-raised-button
          color="primary"
          (click)="retryEvent.emit()"
          @buttonAppear
        >
          {{ 'COMMON.RETRY' | translate }}
        </button>
      </div>

      <!-- Empty state -->
      <div *ngIf="state === 'empty'" class="loading-container__empty">
        <mat-icon
          class="loading-container__icon loading-container__icon--empty"
          [@iconState]="'empty'"
          >inbox</mat-icon
        >
        <p class="loading-container__text">{{ emptyText | translate }}</p>
      </div>
    </div>
  `,
  styles: `
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      width: 100%;
      text-align: center;
      padding: 2rem;
      box-sizing: border-box;

      &__spinner,
      &__error,
      &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      &__text {
        margin: 0;
        color: rgba(0, 0, 0, 0.6);
        font-size: 1rem;
      }

      &__icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;

        &--error {
          color: #f44336;
        }

        &--empty {
          color: #9e9e9e;
        }
      }
    }
  `,
})
export class LoadingComponent {
  @Input() state: LoadingState = 'loading';
  @Input() spinnerSize: number = 40;
  @Input() loadingText: string = 'COMMON.LOADING';
  @Input() errorText: string = 'ERRORS.DEFAULT';
  @Input() emptyText: string = 'COMMON.NO_DATA';
  @Input() showRetry: boolean = true;

  @Output() retryEvent = new EventEmitter<void>();
}
