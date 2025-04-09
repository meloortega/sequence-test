import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  isError?: boolean;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container" [class.dialog-container--error]="data.isError">
      <h2 mat-dialog-title class="dialog-title">
        {{ data.title }}
        <mat-icon *ngIf="data.isError" class="dialog-icon dialog-icon--error">error</mat-icon>
        <mat-icon *ngIf="!data.isError" class="dialog-icon">info</mat-icon>
      </h2>

      <mat-dialog-content>
        <p [innerHTML]="data.message"></p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button *ngIf="data.showCancel !== false" mat-stroked-button (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>

        <button mat-flat-button [color]="data.isError ? 'warn' : 'primary'" (click)="onConfirm()">
          {{ data.confirmText || 'Aceptar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    .dialog-container {
      min-width: 300px;
      max-width: 500px;
      padding: 1.5rem;

      &--error {
        .dialog-title {
          color: #f44336;
        }
      }
    }

    .dialog-title {
      margin: 0;
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .dialog-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 0.5rem;

      &--error {
        color: #f44336;
      }
    }

    mat-dialog-content {
      margin: 1rem 0;

      p {
        margin: 0;
        line-height: 1.5;
      }
    }

    mat-dialog-actions {
      margin-bottom: 0;
      padding-bottom: 0;
    }
  `,
})
export class DialogComponent {
  data = inject(MAT_DIALOG_DATA) as DialogData;
  dialogRef = inject(MatDialogRef<DialogComponent>);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
