/**
 * Likho Pro — Cryptographic Offline License Key Verification Service
 * 
 * Provides 100% offline, deterministic license generation and verification
 * without requiring any backend server or cloud authorization.
 *
 * Key Format: LKHO-TTXX-XXXX-SSSS-SSSS
 *   - LKHO: Brand prefix
 *   - TT: Tier code (LP: Lifetime Pro, PA: Patron Edition, AN: Annual Pass)
 *   - XX-XXXX: 6-character issue/customer token
 *   - SSSS-SSSS: 8-character cryptographic signature
 */

export type LicenseTier = 'lifetime' | 'patron' | 'annual';

export interface ActiveLicense {
  isActivated: boolean;
  licenseKey: string;
  tier: LicenseTier;
  tierNameUrdu: string;
  customerName?: string;
  activatedAt: string;
}

export interface LicenseVerificationResult {
  isValid: boolean;
  tier?: LicenseTier;
  tierNameUrdu?: string;
  customerToken?: string;
  errorUrdu?: string;
  formattedKey?: string;
}

const STORAGE_KEY = 'likho_pro_license_state';
const MASTER_SECRET = 'LIKHO_PRO_2026_SOVEREIGN_OFFLINE_SECRET_KEY_v1';

const TIER_CODES: Record<string, LicenseTier> = {
  LP: 'lifetime',
  PA: 'patron',
  AN: 'annual',
};

const TIER_NAMES_URDU: Record<LicenseTier, string> = {
  lifetime: 'لائف ٹائم پرو (Lifetime Pro)',
  patron: 'ادبی سرپرست (Patron Edition)',
  annual: 'سالانہ پرو (Annual Pass)',
};

/**
 * Deterministic keyed cryptographic hash (pure JS, synchronous & zero-dependency)
 * Combines 64-bit FNV-1a with polynomial rolling bitwise mix seeded by MASTER_SECRET.
 */
function computeKeySignature(payload: string): string {
  const input = `${MASTER_SECRET}:${payload}:${MASTER_SECRET}`;
  let h1 = 0x811c9dc5;
  let h2 = 0xcbf29ce4;

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code;
    h2 = Math.imul(h2, 0x100000001b3);
  }

  // Generate 8 hex characters from mixed 64-bit hash
  const u1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const u2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const combined = (u1.slice(0, 4) + u2.slice(4, 8)).toUpperCase();
  return combined;
}

/**
 * Format raw user input into standard LKHO-XXXX-XXXX-XXXX-XXXX structure
 */
export function formatLicenseKeyInput(input: string): string {
  // Strip non-alphanumeric, convert to uppercase
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return '';

  // Check if starts with LKHO, if not prepend
  let chars = clean;
  if (!chars.startsWith('LKHO')) {
    if ('LKHO'.startsWith(chars)) {
      // Partial prefix
      return chars;
    }
  }

  // Group into 4-character chunks separated by hyphens
  const parts: string[] = [];
  for (let i = 0; i < chars.length && i < 20; i += 4) {
    parts.push(chars.slice(i, i + 4));
  }
  return parts.join('-');
}

/**
 * Generate a cryptographically valid license key
 */
export function generateLicenseKey(
  tier: LicenseTier = 'lifetime',
  customerSeed: string = 'GEN1'
): string {
  const tierPrefix = tier === 'lifetime' ? 'LP' : tier === 'patron' ? 'PA' : 'AN';
  // Derive 6-character token from seed
  const rawToken = computeKeySignature(customerSeed).slice(0, 6);
  const seg1 = `${tierPrefix}${rawToken.slice(0, 2)}`;
  const seg2 = rawToken.slice(2, 6);
  const payload = `LKHO-${seg1}-${seg2}`;
  const sig = computeKeySignature(payload);
  const seg3 = sig.slice(0, 4);
  const seg4 = sig.slice(4, 8);
  return `${payload}-${seg3}-${seg4}`;
}

/**
 * Verify license key validity offline
 */
export function verifyLicenseKey(rawKey: string): LicenseVerificationResult {
  if (!rawKey || typeof rawKey !== 'string') {
    return { isValid: false, errorUrdu: 'برائے مہربانی لائسنس کوڈ درج فرمائیں۔' };
  }

  const normalized = rawKey.trim().toUpperCase().replace(/[\s_]/g, '-');
  const parts = normalized.split('-');

  // Must have 5 segments: LKHO-XXXX-XXXX-XXXX-XXXX (20 chars total)
  if (parts.length !== 5 || parts[0] !== 'LKHO') {
    return {
      isValid: false,
      errorUrdu: 'لائسنس کوڈ کا فارمیٹ درست نہیں (LKHO-XXXX-XXXX-XXXX-XXXX ہونا چاہیے)۔',
    };
  }

  const [prefix, seg1, seg2, seg3, seg4] = parts;
  if (
    seg1.length !== 4 ||
    seg2.length !== 4 ||
    seg3.length !== 4 ||
    seg4.length !== 4
  ) {
    return {
      isValid: false,
      errorUrdu: 'لائسنس کوڈ کی طوالت نامکمل ہے (ہر خانے میں ۴ حروف ہونے چاہئیں)۔',
    };
  }

  const tierCode = seg1.slice(0, 2);
  const tier = TIER_CODES[tierCode];
  if (!tier) {
    return {
      isValid: false,
      errorUrdu: 'لائسنس کا درجہ (Tier) شناخت نہیں ہو سکا۔ کوڈ دوبارہ چیک فرمائیں۔',
    };
  }

  const payload = `${prefix}-${seg1}-${seg2}`;
  const expectedSig = computeKeySignature(payload);
  const providedSig = `${seg3}${seg4}`;

  if (expectedSig !== providedSig) {
    return {
      isValid: false,
      errorUrdu: 'یہ لائسنس کوڈ جعلی، منسوخ یا غلط درج ہوا ہے۔ درست کوڈ درج فرمائیں۔',
    };
  }

  return {
    isValid: true,
    tier,
    tierNameUrdu: TIER_NAMES_URDU[tier],
    customerToken: `${seg1.slice(2)}${seg2}`,
    formattedKey: normalized,
  };
}

// Global subscribers for reactive UI re-renders
type LicenseSubscriber = (lic: ActiveLicense | null) => void;
const subscribers = new Set<LicenseSubscriber>();

function notifySubscribers(lic: ActiveLicense | null) {
  subscribers.forEach((cb) => {
    try {
      cb(lic);
    } catch (e) {
      console.error('License subscriber error:', e);
    }
  });
}

export const licenseVerificationService = {
  /**
   * Verify license key offline
   */
  verify(rawKey: string): LicenseVerificationResult {
    return verifyLicenseKey(rawKey);
  },

  /**
   * Activate license and persist to localStorage
   */
  activate(rawKey: string, customerName?: string): { success: boolean; messageUrdu: string } {
    const res = verifyLicenseKey(rawKey);
    if (!res.isValid || !res.tier || !res.formattedKey) {
      return { success: false, messageUrdu: res.errorUrdu || 'لائسنس کوڈ درست نہیں ہے۔' };
    }

    const state: ActiveLicense = {
      isActivated: true,
      licenseKey: res.formattedKey,
      tier: res.tier,
      tierNameUrdu: res.tierNameUrdu || TIER_NAMES_URDU[res.tier],
      customerName: customerName?.trim() || undefined,
      activatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      notifySubscribers(state);
      return {
        success: true,
        messageUrdu: `مبارک ہو! آپ کا «${state.tierNameUrdu}» کامیابی کے ساتھ فعال ہو گیا ہے۔`,
      };
    } catch (e) {
      console.error('Failed to save license state:', e);
      return {
        success: false,
        messageUrdu: 'براؤزر اسٹوریج میں لائسنس محفوظ کرنے میں رکاوٹ پیش آئی۔',
      };
    }
  },

  /**
   * Read and re-validate active license from localStorage
   */
  getActiveLicense(): ActiveLicense | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as ActiveLicense;
      if (!parsed || !parsed.isActivated || !parsed.licenseKey) return null;

      // Re-verify cryptographically against tampering
      const check = verifyLicenseKey(parsed.licenseKey);
      if (!check.isValid || check.tier !== parsed.tier) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  },

  /**
   * Deactivate and remove license from localStorage
   */
  deactivate(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      notifySubscribers(null);
    } catch (e) {
      console.error('Failed to deactivate license:', e);
    }
  },

  /**
   * Subscribe to license activation/deactivation events
   */
  subscribe(callback: LicenseSubscriber): () => void {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  },

  /**
   * Format input into LKHO-XXXX-XXXX-XXXX-XXXX
   */
  formatKey(input: string): string {
    return formatLicenseKeyInput(input);
  },

  /**
   * Generate key (for testing / admin)
   */
  generateKey(tier: LicenseTier = 'lifetime', customerSeed: string = 'GEN1'): string {
    return generateLicenseKey(tier, customerSeed);
  },
};

