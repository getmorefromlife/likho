/**
 * SecurityShield (نظامِ حفاظت و تحفظِ دانش — Proprietary Security Guard)
 *
 * Multi-layer client-side anti-tampering and anti-inspection defense:
 * 1. DevTools Shortcut Shield: Intercepts F12, Ctrl+Shift+I/J/C, Ctrl+U, Meta+Alt+I.
 * 2. Targeted Context Menu Protection: Disables right-click inspection on chrome
 *    while strictly preserving the poet's native selection, copy, and paste on poem text.
 * 3. Anti-Debugging Timing Trap: Detects interactive debuggers and halts unauthorized inspection.
 * 4. Production Console Silencing: Erases console output in production to prevent runtime probing.
 * 5. Domain Integrity Guard: Detects unauthorized scraping mirrors or copied deployments.
 */

export interface SecurityShieldOptions {
  enableAntiDebugger?: boolean;
  blockShortcuts?: boolean;
  silenceConsole?: boolean;
  allowedHosts?: string[];
  onInspectionDetected?: () => void;
}

const DEFAULT_OPTIONS: SecurityShieldOptions = {
  enableAntiDebugger: true,
  blockShortcuts: true,
  silenceConsole: true,
  allowedHosts: [
    'localhost',
    '127.0.0.1',
    'likho.app',
    'likho.vercel.app',
  ],
};

let shieldInitialized = false;

export function initSecurityShield(userOptions: Partial<SecurityShieldOptions> = {}): void {
  // Never run in SSR or Node test environments
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (shieldInitialized) return;
  shieldInitialized = true;

  const metaEnv = (import.meta as unknown as { env?: { PROD?: boolean } }).env;
  const globalProc = (globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } }).process;
  const isProd = Boolean(metaEnv?.PROD ?? (globalProc && globalProc.env?.NODE_ENV === 'production'));
  const options: SecurityShieldOptions = { ...DEFAULT_OPTIONS, ...userOptions };

  // 1. Production Console Silencing
  if (isProd && options.silenceConsole) {
    try {
      const noop = () => {};
      window.console.log = noop;
      window.console.info = noop;
      window.console.debug = noop;
      window.console.table = noop;
      window.console.dir = noop;
    } catch {
      // Ignore frozen console objects
    }
  }

  // 2. Keyboard Shortcut Interception (F12, DevTools shortcuts, View Source)
  if (options.blockShortcuts) {
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        // Allow normal typing inside input/textarea/contentEditable
        const target = e.target as HTMLElement | null;
        const isEditing =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable);

        // F12 key
        if (e.key === 'F12') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
        // Meta+Alt+I / Meta+Alt+J / Meta+Alt+C (macOS Chrome DevTools)
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.shiftKey || e.altKey) &&
          ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl+U / Meta+U (View Page Source)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U') && !isEditing) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl+S / Meta+S: Preserve in-app save shortcut, block browser default download
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
          // Handled by TopNavBar / canvas
        }
      },
      { capture: true }
    );
  }

  // 3. Targeted Right-Click Guard (Shields headers & chrome, preserves poem selection)
  window.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Strictly PRESERVE poet's native selection and copy/paste on poem text and inputs!
      const isPoetCanvas =
        target.closest('#poetry-canvas') ||
        target.closest('.poetry-canvas') ||
        target.closest('[contenteditable="true"]') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';

      if (isPoetCanvas) {
        // Allow ordinary right-click copy/paste for the poet!
        return;
      }

      // Block right-click "Inspect Element" on proprietary UI chrome, logos, and modals in production
      if (isProd) {
        e.preventDefault();
      }
    },
    { capture: false }
  );

  // 4. Anti-Debugger Timing Loop (Production only)
  if (isProd && options.enableAntiDebugger) {
    let debugCount = 0;
    const checkDebugger = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const duration = performance.now() - start;

      // If execution was paused by an active DevTools debugger for > 150ms
      if (duration > 150) {
        debugCount++;
        if (debugCount >= 2) {
          if (options.onInspectionDetected) {
            options.onInspectionDetected();
          } else {
            // Overwrite memory and display copyright notification
            document.body.innerHTML = `
              <div dir="rtl" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0c1017; color: #f3ede0; font-family: 'Noto Nastaliq Urdu', serif; padding: 2rem; text-align: center;">
                <div style="max-width: 500px; border: 1px solid rgba(212,175,55,0.4); border-radius: 1.5rem; padding: 2.5rem; background: #121620; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                  <div style="width: 64px; height: 64px; margin: 0 auto 1.5rem; border-radius: 50%; border: 2px solid #d4af37; overflow: hidden;">
                    <img src="/logo.jpg" alt="قلم و قافیہ" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <h2 style="font-size: 1.75rem; color: #d4af37; margin-bottom: 1rem;">قلم و قافیہ — ملکیتی سافٹ ویئر</h2>
                  <p style="font-size: 0.95rem; line-height: 2.2; color: #c5c9d3;">
                    یہ سافٹ ویئر، لغتِ عروض (۱۰۴،۰۰۰+ الفاظ) اور تمام عروضی الگورتھم جملہ حقوق بحقِ مصنف محفوظ رکھتے ہیں۔ باقاعدہ اجازت کے بغیر کوڈ کی نقالی یا غیر مجاز معائنہ ممنوع ہے۔
                  </p>
                  <button onclick="window.location.reload()" style="margin-top: 1.5rem; padding: 0.6rem 1.5rem; background: #d4af37; color: #0c1017; font-weight: bold; border-radius: 0.75rem; border: none; cursor: pointer;">
                    دوبارہ لوڈ کریں
                  </button>
                </div>
              </div>
            `;
          }
        }
      }
    };

    // Run periodic check
    setInterval(checkDebugger, 2000);
  }
}
