import { inject, InjectionToken, Signal, signal, effect } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Resource<T> {
  isLoading: Signal<boolean>;
  getAll: () => Signal<T[]>;
  getById: (id: number) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  delete: (id: number) => Promise<void>;
}

export const createResource = <T>(token: InjectionToken<Resource<T>>, apiUrl: string) => {
  return [
    provideHttpClient(),
    {
      provide: token,
      useFactory: () => {
        const http = inject(HttpClient);
        const refreshTrigger = signal(0);
        const data = signal<T[]>([]);
        const isLoading = signal(false);

        const loadData = async () => {
          try {
            isLoading.set(true);
            const response = await firstValueFrom(http.get<T[]>(`${environment.apiUrl}${apiUrl}`));
            data.set(response);
          } catch (error) {
            console.error(`Error loading resource`, error);
          } finally {
            isLoading.set(false);
          }
        };

        effect(() => {
          refreshTrigger();
          loadData();
        });

        const refresh = () => refreshTrigger.update((n) => n + 1);

        return {
          getAll: () => data.asReadonly(),
          getById: async (id: number) => {
            isLoading.set(true);
            const resource = await firstValueFrom(
              http.get<T>(`${environment.apiUrl}${apiUrl}/${id}`),
            );
            isLoading.set(false);
            return resource;
          },

          create: async (resourceData: Partial<T>) => {
            isLoading.set(true);
            const created = await firstValueFrom(
              http.post<T>(`${environment.apiUrl}${apiUrl}`, resourceData),
            );
            refresh();
            isLoading.set(false);
            return created;
          },

          update: async (id: number, resourceData: Partial<T>) => {
            isLoading.set(true);
            const updated = await firstValueFrom(
              http.patch<T>(`${environment.apiUrl}${apiUrl}/${id}`, resourceData),
            );
            refresh();
            isLoading.set(false);
            return updated;
          },

          delete: async (id: number) => {
            isLoading.set(true);
            await firstValueFrom(http.delete<void>(`${environment.apiUrl}${apiUrl}/${id}`));
            refresh();
            isLoading.set(false);
          },
        };
      },
    },
  ];
};
