import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogComponent } from './dialog.component';

export interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isError?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  openConfirmDialog(data: DialogData): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: data.title,
      message: data.message,
      confirmText: data.confirmText || 'Confirmar',
      cancelText: data.cancelText || 'Cancelar',
      isError: data.isError || false,
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  openInfoDialog(title: string, message: string): Observable<void> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title,
      message,
      confirmText: 'Aceptar',
      showCancel: false,
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  openErrorDialog(title: string, message: string): Observable<void> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title,
      message,
      confirmText: 'Aceptar',
      showCancel: false,
      isError: true,
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    return dialogRef.afterClosed();
  }
}
