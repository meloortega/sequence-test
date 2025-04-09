import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../dialog/dialog.service';
import { TRANSLATION_RESOURCE } from '../../resources/translation.resource';

@Injectable({
  providedIn: 'root',
})
export class AppErrorHandlerService implements ErrorHandler {
  private dialogService = inject(DialogService);
  private translationResource = inject(TRANSLATION_RESOURCE);
  private ngZone = inject(NgZone);

  handleError(error: any): void {
    console.error('Error captured by AppErrorHandler:', error);

    // Extraer el mensaje adecuado del error
    const errorMessage = this.getErrorMessage(error);

    // Usar NgZone para asegurarnos que los diálogos se muestran correctamente
    this.ngZone.run(() => {
      this.dialogService.openErrorDialog(
        this.translationResource.translate('DIALOGS.ERROR.TITLE'),
        errorMessage,
      );
    });
  }

  getErrorMessage(error: any): string {
    // Si es un error HTTP
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        return this.translationResource.translate('ERRORS.NOT_FOUND');
      }
      if (error.status === 0) {
        return this.translationResource.translate('ERRORS.NETWORK');
      }
      return error.message || this.translationResource.translate('ERRORS.UNKNOWN');
    }
    if (error?.message) {
      return error.message;
    }

    return this.translationResource.translate('ERRORS.DEFAULT');
  }
}
