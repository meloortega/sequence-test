import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('shimmer', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
  template: `
    <div
      class="skeleton"
      [class.skeleton--text]="type === 'text'"
      [class.skeleton--circle]="type === 'circle'"
      [class.skeleton--rect]="type === 'rect'"
      [style.width]="width"
      [style.height]="height"
      [style.border-radius]="borderRadius"
      @shimmer
    ></div>
  `,
  styles: `
    .skeleton {
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.06) 25%,
        rgba(0, 0, 0, 0.1) 37%,
        rgba(0, 0, 0, 0.06) 63%
      );
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }

    .skeleton--text {
      height: 1em;
      margin: 0.5em 0;
    }

    .skeleton--circle {
      border-radius: 50%;
    }

    .skeleton--rect {
      border-radius: 4px;
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0 50%;
      }
    }
  `,
})
export class SkeletonComponent {
  @Input() type: 'text' | 'circle' | 'rect' = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '1em';
  @Input() borderRadius: string = '4px';
}
