import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private translateService = inject(TranslateService);

  success(messageKey: string, duration: number = 3000): void {
    this.translateService.get(messageKey).subscribe((message) => {
      this.snackBar.open(message, 'OK', {
        duration,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  }

  error(messageKey: string, duration: number = 5000): void {
    this.translateService.get(messageKey).subscribe((message) => {
      this.snackBar.open(message, 'OK', {
        duration,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  }

  info(messageKey: string, duration: number = 3000): void {
    this.translateService.get(messageKey).subscribe((message) => {
      this.snackBar.open(message, 'OK', {
        duration,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  }
}
