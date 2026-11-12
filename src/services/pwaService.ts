/**
 * Likho Pro (قلم و قافیہ) - Progressive Web App Service
 * Handles Service Worker registration, standalone window detection,
 * and 1-click install prompt lifecycle.
 */

import { useState, useEffect } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export type PWAInstallOutcome = 'accepted' | 'dismissed' | 'already_installed' | 'ios_guide' | 'unsupported';

type PWAChangeListener = (state: PWAState) => void;

export interface PWAState {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private listeners: Set<PWAChangeListener> = new Set();
  private state: PWAState = {
    canInstall: false,
    isInstalled: false,
    isStandalone: false,
    isIOS: false,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    const isStandalone = this.checkIsStandalone();
    const isIOS = this.checkIsIOS();

    this.state = {
      ...this.state,
      isStandalone,
      isInstalled: isStandalone,
      isIOS,
    };

    // Capture install prompt event before browser's default prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.updateState({ canInstall: true });
    });

    // Detect when the app has been successfully installed
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.updateState({
        canInstall: false,
        isInstalled: true,
      });
      console.log('[Likho PWA] App installed successfully');
    });

    // Watch for display mode changes (e.g. launched from desktop shortcut)
    try {
      const matchMedia = window.matchMedia('(display-mode: standalone)');
      matchMedia.addEventListener('change', (e) => {
        const standalone = e.matches;
        this.updateState({
          isStandalone: standalone,
          isInstalled: standalone || this.state.isInstalled,
        });
      });
    } catch {
      // Fallback for older browsers
    }
  }

  private checkIsStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    const isStandaloneMedia = window.matchMedia?.('(display-mode: standalone)').matches;
    const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    return Boolean(isStandaloneMedia || isNavigatorStandalone);
  }

  private checkIsIOS(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  }

  private updateState(partial: Partial<PWAState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('[Likho PWA] Listener error:', err);
      }
    });
  }

  public getState(): PWAState {
    return this.state;
  }

  public subscribe(listener: PWAChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Prompts the user to install the application.
   */
  public async promptInstall(): Promise<PWAInstallOutcome> {
    if (this.state.isStandalone) {
      return 'already_installed';
    }

    if (this.deferredPrompt) {
      try {
        await this.deferredPrompt.prompt();
        const choice = await this.deferredPrompt.userChoice;
        this.deferredPrompt = null;
        this.updateState({ canInstall: false });
        return choice.outcome;
      } catch (err) {
        console.warn('[Likho PWA] Prompt failed:', err);
        return 'dismissed';
      }
    }

    if (this.state.isIOS) {
      return 'ios_guide';
    }

    return 'unsupported';
  }

  /**
   * Register service worker in supported environments.
   */
  public registerServiceWorker(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[Likho PWA] ServiceWorker registered with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[Likho PWA] New update available.');
                  } else {
                    console.log('[Likho PWA] Content cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[Likho PWA] ServiceWorker registration failed:', err);
        });
    });
  }
}

export const pwaService = new PWAManager();

/**
 * React hook to access PWA installation state and trigger install
 */
export function usePWAInstall() {
  const [state, setState] = useState<PWAState>(() => pwaService.getState());

  useEffect(() => {
    return pwaService.subscribe(setState);
  }, []);

  const install = async (): Promise<PWAInstallOutcome> => {
    return pwaService.promptInstall();
  };

  return {
    ...state,
    promptInstall: install,
  };
}

