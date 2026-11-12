import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const temporary = await mkdtemp(join(tmpdir(), 'likho-license-'));
const memory = new Map();

try {
  globalThis.localStorage = {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, value) => { memory.set(k, value); },
    removeItem: (k) => { memory.delete(k); },
  };

  await build({
    entryPoints: ['src/services/licenseVerificationService.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: join(temporary, 'license.mjs'),
  });

  const {
    verifyLicenseKey,
    generateLicenseKey,
    formatLicenseKeyInput,
    licenseVerificationService,
  } = await import(pathToFileURL(join(temporary, 'license.mjs')));

  let passed = 0;
  const test = (name, fn) => {
    fn();
    passed++;
    console.log(`✓ ${name}`);
  };

  test('generates valid cryptographic license keys for all tiers', () => {
    const lifetimeKey = generateLicenseKey('lifetime', 'poet-ghalib');
    assert.match(lifetimeKey, /^LKHO-LP[0-9A-F]{2}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/);
    const verifyLifetime = verifyLicenseKey(lifetimeKey);
    assert.equal(verifyLifetime.isValid, true);
    assert.equal(verifyLifetime.tier, 'lifetime');

    const patronKey = generateLicenseKey('patron', 'poet-iqbal');
    assert.match(patronKey, /^LKHO-PA[0-9A-F]{2}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/);
    const verifyPatron = verifyLicenseKey(patronKey);
    assert.equal(verifyPatron.isValid, true);
    assert.equal(verifyPatron.tier, 'patron');

    const annualKey = generateLicenseKey('annual', 'poet-mir');
    assert.match(annualKey, /^LKHO-AN[0-9A-F]{2}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/);
    const verifyAnnual = verifyLicenseKey(annualKey);
    assert.equal(verifyAnnual.isValid, true);
    assert.equal(verifyAnnual.tier, 'annual');
  });

  test('handles case-insensitivity and whitespace formatting gracefully', () => {
    const key = generateLicenseKey('lifetime', 'test-user');
    const lowerCaseKey = key.toLowerCase();
    const resLower = verifyLicenseKey(lowerCaseKey);
    assert.equal(resLower.isValid, true);
    assert.equal(resLower.formattedKey, key);

    const spacedKey = `   ${key}   `;
    const resSpaced = verifyLicenseKey(spacedKey);
    assert.equal(resSpaced.isValid, true);
    assert.equal(resSpaced.formattedKey, key);
  });

  test('strictly rejects forged or tampered license keys', () => {
    const validKey = generateLicenseKey('lifetime', 'authentic-customer');
    assert.equal(verifyLicenseKey(validKey).isValid, true);

    // Alter last character of signature
    const lastChar = validKey[validKey.length - 1];
    const alteredChar = lastChar === 'A' ? 'B' : 'A';
    const tamperedSig = validKey.slice(0, -1) + alteredChar;
    const resTampered = verifyLicenseKey(tamperedSig);
    assert.equal(resTampered.isValid, false);
    assert.ok(resTampered.errorUrdu?.includes('غلط') || resTampered.errorUrdu?.includes('جعلی'));

    // Alter tier code
    const tamperedTier = validKey.replace('LKHO-LP', 'LKHO-XX');
    const resTamperedTier = verifyLicenseKey(tamperedTier);
    assert.equal(resTamperedTier.isValid, false);

    // Random garbage
    assert.equal(verifyLicenseKey('LKHO-FAKE-CODE-HERE-1234').isValid, false);
    assert.equal(verifyLicenseKey('INVALID-PREFIX-1234').isValid, false);
    assert.equal(verifyLicenseKey('').isValid, false);
  });

  test('formats partial and full license key input strings correctly', () => {
    assert.equal(formatLicenseKeyInput('lkho'), 'LKHO');
    assert.equal(formatLicenseKeyInput('lkhop123'), 'LKHO-P123');
    assert.equal(formatLicenseKeyInput('lkhop123456789012345'), 'LKHO-P123-4567-8901-2345');
  });

  test('activates valid license and persists to localStorage', () => {
    memory.clear();
    const key = generateLicenseKey('lifetime', 'verified-buyer');
    const actResult = licenseVerificationService.activate(key, 'احمد فراز');
    assert.equal(actResult.success, true);
    assert.ok(actResult.messageUrdu.includes('فعال'));

    const active = licenseVerificationService.getActiveLicense();
    assert.ok(active);
    assert.equal(active.isActivated, true);
    assert.equal(active.tier, 'lifetime');
    assert.equal(active.customerName, 'احمد فراز');
  });

  test('tamper resistance: manually altering stored key in storage causes safe rejection', () => {
    const key = generateLicenseKey('lifetime', 'tamper-test');
    licenseVerificationService.activate(key);
    assert.ok(licenseVerificationService.getActiveLicense());

    // Tamper with key in storage
    const raw = JSON.parse(memory.get('likho_pro_license_state'));
    raw.licenseKey = 'LKHO-FORGED-KEY-1234-5678';
    memory.set('likho_pro_license_state', JSON.stringify(raw));

    assert.equal(licenseVerificationService.getActiveLicense(), null);
    assert.equal(globalThis.localStorage.getItem('likho_pro_license_state'), null); // Cleared automatically
  });

  console.log(`${passed} license verification checks passed.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
