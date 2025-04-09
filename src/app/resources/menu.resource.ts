import { InjectionToken, signal, Signal } from '@angular/core';

const MENU_STATE_KEY = 'menuState';

function getInitialState(): boolean {
  const stored = sessionStorage.getItem(MENU_STATE_KEY);
  return stored ? JSON.parse(stored) : false;
}

function persistState(state: boolean) {
  sessionStorage.setItem(MENU_STATE_KEY, JSON.stringify(state));
}

export interface MenuResource {
  isMenuOpen: Signal<boolean>;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const MENU_RESOURCE = new InjectionToken<MenuResource>('MenuResource');

export const provideMenuResource = () => {
  const isMenuOpenSignal = signal<boolean>(getInitialState());

  return {
    provide: MENU_RESOURCE,
    useFactory: () => {
      const toggleMenu = () => {
        isMenuOpenSignal.update((current) => {
          const next = !current;
          persistState(next);
          return next;
        });
      };

      const closeMenu = () => {
        isMenuOpenSignal.set(false);
        persistState(false);
      };

      return {
        isMenuOpen: isMenuOpenSignal.asReadonly(),
        toggleMenu,
        closeMenu,
      };
    },
  };
};
