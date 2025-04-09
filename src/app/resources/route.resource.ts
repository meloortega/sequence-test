import { inject, InjectionToken, signal, Signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface RouteResource {
  currentRoute: Signal<string>;
}

export const ROUTE_RESOURCE = new InjectionToken<RouteResource>('RouteResource');

export const provideRouteResource = () => {
  const currentRouteSignal = signal<string>('');

  return {
    provide: ROUTE_RESOURCE,
    useFactory: () => {
      const router = inject(Router);

      if (!currentRouteSignal()) {
        currentRouteSignal.set(router.url);
      }

      router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          currentRouteSignal.set(event.urlAfterRedirects);
        });

      return {
        currentRoute: currentRouteSignal.asReadonly(),
      };
    },
  };
};
