import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should show a success notification with translated message', () => {
      const messageKey = 'TEST.SUCCESS';
      const translatedMessage = 'Operación exitosa';

      translateServiceSpy.get.and.returnValue(of(translatedMessage));

      service.success(messageKey);

      expect(translateServiceSpy.get).toHaveBeenCalledWith(messageKey);
      expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, 'OK', {
        duration: 3000,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });

    it('should allow custom duration', () => {
      const messageKey = 'TEST.SUCCESS';
      const translatedMessage = 'Operación exitosa';
      const customDuration = 5000;

      translateServiceSpy.get.and.returnValue(of(translatedMessage));

      service.success(messageKey, customDuration);

      expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, 'OK', {
        duration: customDuration,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  });

  describe('error', () => {
    it('should show an error notification with translated message', () => {
      const messageKey = 'TEST.ERROR';
      const translatedMessage = 'Ha ocurrido un error';

      translateServiceSpy.get.and.returnValue(of(translatedMessage));

      service.error(messageKey);

      expect(translateServiceSpy.get).toHaveBeenCalledWith(messageKey);
      expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, 'OK', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });

    it('should allow custom duration', () => {
      const messageKey = 'TEST.ERROR';
      const translatedMessage = 'Ha ocurrido un error';
      const customDuration = 10000;

      translateServiceSpy.get.and.returnValue(of(translatedMessage));

      service.error(messageKey, customDuration);

      expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, 'OK', {
        duration: customDuration,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  });

  describe('info', () => {
    it('should show an info notification with translated message', () => {
      const messageKey = 'TEST.INFO';
      const translatedMessage = 'Información importante';

      translateServiceSpy.get.and.returnValue(of(translatedMessage));

      service.info(messageKey);

      expect(translateServiceSpy.get).toHaveBeenCalledWith(messageKey);
      expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, 'OK', {
        duration: 3000,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });

    it('should allow custom duration', () => {
      const messageKey = 'TEST.INFO';
      const translatedMessage = 'Información importante';
      const customDuration = 8000;

      translateServiceSpy.get.and.returnValue(of(translatedMessage));

      service.info(messageKey, customDuration);

      expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, 'OK', {
        duration: customDuration,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  });
});
