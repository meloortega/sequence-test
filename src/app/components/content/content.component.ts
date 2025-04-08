import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content" [ngClass]="customClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    .content {
      max-width: 1120px;
      margin-left: auto;
      margin-right: auto;
      padding: 1rem;

      &--padded {
        padding: 2rem;
      }

      &--narrow {
        max-width: 768px;
      }

      &--full {
        max-width: none;
        width: 100%;
      }
    }
  `,
})
export class ContentComponent {
  @Input() customClass: string = '';
}
