import { test, expect, type Page } from '@playwright/test';
const key = 'qalam_drafts_v1';
const draft = (id = 'ordinary-a') => ({ id, title: `عنوان ${id}`, poet: 'شاعر آزمائش', form: 'ghazal', tags: [], createdAt: 1, updatedAt: 1, qafiyaList: [], content: 'مرا دل مرا دل\nمرا دل مرا دل' });
async function boot(page: Page, raw?: string) {
  await page.addInitScript(({ key, raw }) => {
    if (!sessionStorage.getItem('draft-safety-seeded')) {
      localStorage.clear();
      if (raw !== undefined) localStorage.setItem(key, raw);
      sessionStorage.setItem('draft-safety-seeded', '1');
    }
  }, { key, raw });
  await page.clock.install();
  await page.goto('/');
}
const rawStore = (page: Page) => page.evaluate(key => localStorage.getItem(key), key);
async function settle(page: Page) { await page.clock.runFor(1700); }
async function portfolio(page: Page) { await page.getByRole('button', { name: 'دیوانِ کلام', exact: true }).click(); }
async function failDraftWrites(page: Page, kind: 'quota' | 'generic' = 'quota') {
  await page.evaluate(({ key, kind }) => {
    const original = Storage.prototype.setItem;
    (window as any).__restoreWrites = () => { Storage.prototype.setItem = original; };
    Storage.prototype.setItem = function(k, value) {
      if (k === key) {
        if (kind === 'quota') throw new DOMException('Injected drafts quota failure', 'QuotaExceededError');
        throw new Error('Injected generic drafts write failure');
      }
      return original.call(this, k, value);
    };
  }, { key, kind });
}
async function restoreBackup(page: Page, data: unknown) {
  await portfolio(page);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
}

test.describe('LKH-002 preservation', () => {
  test.describe.configure({ timeout: 20000 });
  test.afterEach(async ({ page }, info) => {
    if (!page.isClosed()) await info.attach('draft-storage.json', { body: JSON.stringify({ raw: await rawStore(page).catch(() => null) }, null, 2), contentType: 'application/json' });
  });
  test('S1 sample first line and metadata survive autosave, another read and reload', async ({ page }) => {
    await boot(page);
    await page.locator('#misra-input-0').fill('میرا محفوظ پہلا مصرع S1');
    await page.locator('#poem-title-input').fill('میرا عنوان S1');
    await page.getByPlaceholder('شاعر کا نام...').fill('میرا نام S1');
    await settle(page);
    await portfolio(page); // A real additional storage read, without changing the fixture.
    await expect.poll(() => rawStore(page)).toContain('میرا محفوظ پہلا مصرع S1');
    await page.reload();
    await expect(page.locator('#misra-input-0')).toHaveValue('میرا محفوظ پہلا مصرع S1');
    await expect(page.locator('#poem-title-input')).toHaveValue('میرا عنوان S1');
    await expect(page.getByPlaceholder('شاعر کا نام...')).toHaveValue('میرا نام S1');
  });
  test('S2 sample later-line edit survives reload', async ({ page }) => {
    await boot(page);
    await page.locator('#misra-input-1').fill('میرا محفوظ دوسرا مصرع S2');
    await settle(page);
    await expect.poll(() => rawStore(page)).toContain('میرا محفوظ دوسرا مصرع S2');
    await page.reload();
    await expect(page.locator('#misra-input-1')).toHaveValue('میرا محفوظ دوسرا مصرع S2');
  });
  test('S3 ordinary draft text survives reload', async ({ page }) => {
    await boot(page, JSON.stringify([draft()]));
    await page.locator('#misra-input-0').fill('میرا عام مسودہ S3');
    await settle(page);
    await expect.poll(() => rawStore(page)).toContain('میرا عام مسودہ S3');
    await page.reload();
    await expect(page.locator('#misra-input-0')).toHaveValue('میرا عام مسودہ S3');
  });
  test('S4 empty portfolio is not silently reseeded or autosaved', async ({ page }) => {
    await boot(page, '[]');
    await settle(page);
    expect(await rawStore(page)).toBe('[]');
    await page.reload();
    await settle(page);
    expect(await rawStore(page)).toBe('[]');
    await page.locator('#misra-input-0').fill('جديد مسودہ S4');
    await settle(page);
    await expect.poll(() => rawStore(page)).toContain('جديد مسودہ S4');
    expect(await rawStore(page)).not.toContain('draft-initial-ghalib');
  });
  test('S5 exact title spelling is authoritative', async ({ page }) => {
    const item = { ...draft(), title: 'نازہ کی اصل عبارت S5' };
    await boot(page, JSON.stringify([item]));
    await expect(page.locator('#poem-title-input')).toHaveValue(item.title);
    await page.locator('#misra-input-0').fill('میرا عام مسودہ S5');
    await settle(page);
    await page.reload();
    await expect(page.locator('#poem-title-input')).toHaveValue(item.title);
  });
  for (const [id, raw] of [['S8', '{unreadable-original-S8'], ['S9', JSON.stringify([{ ...draft(), content: 42 }])]] as const) {
    test(`${id} unreadable/invalid storage remains byte-for-byte intact after an edit`, async ({ page }) => {
      await boot(page, raw);
      await expect(page.getByRole('button', { name: /بازیابی|Recovery|خراب ذخیرہ/i })).toBeVisible();
      await page.locator('#poem-title-input').fill(`جلسے کا عنوان ${id}`);
      await settle(page);
      expect(await rawStore(page)).toBe(raw);
      await page.reload();
      expect(await rawStore(page)).toBe(raw);
    });
  }
});

test.describe('LKH-003 open acceptance contracts', () => {
  test.describe.configure({ timeout: 20000 });
  test.afterEach(async ({ page }, info) => {
    if (!page.isClosed()) await info.attach('draft-storage.json', { body: JSON.stringify({ raw: await rawStore(page).catch(() => null) }, null, 2), contentType: 'application/json' });
  });
  for (const [label, kind] of [['quota-exceeded', 'quota'], ['generic', 'generic']] as const) {
    test(`S6 ${label} draft write retains text and must not claim saved`, async ({ page }) => {
      await boot(page, JSON.stringify([draft()]));
      await failDraftWrites(page, kind);
      await page.locator('#misra-input-0').fill('نہ محفوظ مگر دستیاب S6');
      await settle(page);
      await expect(page.locator('#misra-input-0')).toHaveValue('نہ محفوظ مگر دستیاب S6');
      expect(await rawStore(page)).not.toContain('نہ محفوظ مگر دستیاب S6');
      await expect(page.getByText('محفوظ شدہ', { exact: true })).toHaveCount(0);
    });
  }
  test('S7 failed draft save offers explicit retry', async ({ page }) => {
    await boot(page, JSON.stringify([draft()]));
    await failDraftWrites(page);
    await page.locator('#misra-input-0').fill('دوبارہ محفوظ S7');
    await settle(page);
    await page.evaluate(() => (window as any).__restoreWrites());
    await page.getByRole('button', { name: /دوبارہ کوشش|Retry/i }).click({ timeout: 2500 });
    await expect.poll(() => rawStore(page)).toContain('دوبارہ محفوظ S7');
  });
  test('S10 corrupt originals have a visible recovery route even if recovery writes fail', async ({ page }) => {
    const original = '{recovery-original-S10';
    await boot(page, original);
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked', 'QuotaExceededError'); }; });
    await settle(page);
    expect(await rawStore(page)).toBe(original);
    await expect(page.getByRole('button', { name: /بازیابی|Recovery|خراب ذخیرہ/i })).toBeVisible({ timeout: 2500 });
  });
  test('S11 malformed backup is rejected without changing drafts', async ({ page }) => {
    const before = JSON.stringify([draft()]);
    await boot(page, before);
    const prefsKey = 'qalam_workspace_prefs';
    const beforePrefs = await page.evaluate(k => localStorage.getItem(k), prefsKey);
    await restoreBackup(page, { version: '1.0', drafts: [{ ...draft('bad'), content: 42 }] });
    expect(await rawStore(page)).toBe(before);
    expect(await page.evaluate(k => localStorage.getItem(k), prefsKey)).toBe(beforePrefs);
    await page.reload();
    expect(await rawStore(page)).toBe(before);
  });
  test('S12 valid replacement preserves previous portfolio for recovery', async ({ page }) => {
    const before = JSON.stringify([draft()]);
    await boot(page, before);
    await restoreBackup(page, { version: '1.0', drafts: [draft('restored')], prefs: {} });
    await expect.poll(() => rawStore(page)).toContain('restored');
    const recovery = await page.evaluate(({ key, before }) => Object.keys(localStorage).some(k => k !== key && localStorage.getItem(k)?.includes(before)), { key, before });
    expect(recovery).toBe(true);
    expect(await page.evaluate(() => localStorage.getItem('qalam_workspace_prefs'))).toBe('{}');
  });
  test('S13 dirty navigation warns before leaving', async ({ page }) => {
    await boot(page, JSON.stringify([draft()]));
    let warned = false;
    page.on('dialog', async dialog => { if (dialog.type() === 'beforeunload') warned = true; await dialog.dismiss(); });
    await page.locator('#misra-input-0').fill('لمحاتی تبدیلی S13');
    await page.reload({ timeout: 3000 }).catch(() => {});
    expect(warned).toBe(true);
  });
  test('S14 a newer edit is never labelled saved before its debounce commits', async ({ page }) => {
    await boot(page, JSON.stringify([draft()]));
    await page.locator('#misra-input-0').fill('پہلی تبدیلی S14');
    await settle(page);
    await expect.poll(() => rawStore(page)).toContain('پہلی تبدیلی S14');
    await page.locator('#misra-input-0').fill('دوسری تبدیلی S14');
    await expect(page.getByText('محفوظ شدہ', { exact: true })).toHaveCount(0);
    await settle(page);
    await expect.poll(() => rawStore(page)).toContain('دوسری تبدیلی S14');
  });
  test('S15 real aborted proposal transaction must not report durable success', async ({ page }) => {
    await boot(page, JSON.stringify([draft()]));
    await page.getByRole('button', { name: 'علمِ عروض', exact: true }).click();
    await page.getByRole('button', { name: /نظمِ لغت و نظرثانی/ }).click();
    await page.getByTestId('lexicon-search').fill('آرٹ');
    await page.getByTestId('lexicon-row').filter({ hasText: 'likho:quarantine:513' }).getByRole('button').click();
    await page.getByTestId('proposal-pattern').fill('=-');
    await page.evaluate(() => {
      const original = IDBDatabase.prototype.transaction;
      IDBDatabase.prototype.transaction = function(...args: any[]) {
        const tx = original.apply(this, args as any);
        if (this.name === 'QalamAroozDB' && args[1] === 'readwrite') queueMicrotask(() => { try { tx.abort(); } catch {} });
        return tx;
      } as typeof original;
    });
    await page.getByTestId('proposal-save').click();
    await expect(page.getByTestId('proposal-editor')).toContainText(/نشست|مستقل ذخیرہ|session/i, { timeout: 2500 });

    // Deletion uses its own real aborted transaction; it must not claim durable removal.
    await page.getByTestId('proposal-delete').click();
    await expect(page.getByTestId('proposal-editor')).toContainText(/نشست|مستقل حذف|session/i, { timeout: 2500 });
  });
  test('S16 deleting the active dirty draft does not resurrect it on autosave', async ({ page }) => {
    await boot(page, JSON.stringify([draft()]));
    await page.locator('#misra-input-0').fill('حذف ہونے والا S16');
    await portfolio(page);
    page.once('dialog', dialog => dialog.accept());
    await page.getByTitle('مسودہ حذف کریں').click();
    await settle(page);
    expect(JSON.parse((await rawStore(page))!)).toEqual([]);
  });
  test('S17 reload reopens the selected draft rather than drafts[0]', async ({ page }) => {
    const items = [draft('ordinary-a'), { ...draft('ordinary-b'), content: 'منتخب مسودہ S17' }];
    await boot(page, JSON.stringify(items));
    await portfolio(page);
    await page.getByRole('heading', { name: items[1].title, exact: true }).click();
    await expect(page.locator('#misra-input-0')).toHaveValue(items[1].content);
    await settle(page);
    await page.reload();
    await expect(page.locator('#misra-input-0')).toHaveValue(items[1].content);
  });
});
