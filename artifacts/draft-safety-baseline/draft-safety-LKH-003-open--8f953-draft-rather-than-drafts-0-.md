# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-003 open acceptance contracts >> S17 reload reopens the selected draft rather than drafts[0]
- Location: tests/e2e/draft-safety.spec.ts:187:3

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  locator('#misra-input-0')
Expected: "منتخب مسودہ S17"
Received: "مرا دل مرا دل"
Timeout:  10000ms

Call log:
  - Expect "toHaveValue" locator('#misra-input-0') with timeout 10000ms
  - waiting for locator('#misra-input-0')
    24 × locator resolved to <input dir="rtl" type="text" id="misra-input-0" value="مرا دل مرا دل" placeholder="مصرع تحریر فرمائیں..." class="w-full bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]/40 font-nastaliq py-2.5 px-4 leading-[2.6]"/>
       - unexpected value "مرا دل مرا دل"

```

```yaml
- textbox "مصرع تحریر فرمائیں...": مرا دل مرا دل
```

# Test source

```ts
  95  | });
  96  | 
  97  | test.describe('LKH-003 open acceptance contracts', () => {
  98  |   test.describe.configure({ timeout: 20000 });
  99  |   test.afterEach(async ({ page }, info) => {
  100 |     if (!page.isClosed()) await info.attach('draft-storage.json', { body: JSON.stringify({ raw: await rawStore(page).catch(() => null) }, null, 2), contentType: 'application/json' });
  101 |   });
  102 |   test('S6 failed draft write retains text and must not claim saved', async ({ page }) => {
  103 |     await boot(page, JSON.stringify([draft()]));
  104 |     await failDraftWrites(page);
  105 |     await page.locator('#misra-input-0').fill('نہ محفوظ مگر دستیاب S6');
  106 |     await settle(page);
  107 |     await expect(page.locator('#misra-input-0')).toHaveValue('نہ محفوظ مگر دستیاب S6');
  108 |     expect(await rawStore(page)).not.toContain('نہ محفوظ مگر دستیاب S6');
  109 |     await expect(page.getByText('محفوظ شدہ', { exact: true })).toHaveCount(0);
  110 |   });
  111 |   test('S7 failed draft save offers explicit retry', async ({ page }) => {
  112 |     await boot(page, JSON.stringify([draft()]));
  113 |     await failDraftWrites(page);
  114 |     await page.locator('#misra-input-0').fill('دوبارہ محفوظ S7');
  115 |     await settle(page);
  116 |     await page.evaluate(() => (window as any).__restoreWrites());
  117 |     await page.getByRole('button', { name: /دوبارہ کوشش|Retry/i }).click({ timeout: 2500 });
  118 |     await expect.poll(() => rawStore(page)).toContain('دوبارہ محفوظ S7');
  119 |   });
  120 |   test('S10 corrupt originals have a visible recovery route even if recovery writes fail', async ({ page }) => {
  121 |     const original = '{recovery-original-S10';
  122 |     await boot(page, original);
  123 |     await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked', 'QuotaExceededError'); }; });
  124 |     await settle(page);
  125 |     expect(await rawStore(page)).toBe(original);
  126 |     await expect(page.getByRole('button', { name: /بازیابی|Recovery|خراب ذخیرہ/i })).toBeVisible({ timeout: 2500 });
  127 |   });
  128 |   test('S11 malformed backup is rejected without changing drafts', async ({ page }) => {
  129 |     const before = JSON.stringify([draft()]);
  130 |     await boot(page, before);
  131 |     await restoreBackup(page, { version: '1.0', drafts: [{ ...draft('bad'), content: 42 }] });
  132 |     expect(await rawStore(page)).toBe(before);
  133 |   });
  134 |   test('S12 valid replacement preserves previous portfolio for recovery', async ({ page }) => {
  135 |     const before = JSON.stringify([draft()]);
  136 |     await boot(page, before);
  137 |     await restoreBackup(page, { version: '1.0', drafts: [draft('restored')], prefs: {} });
  138 |     await expect.poll(() => rawStore(page)).toContain('restored');
  139 |     const recovery = await page.evaluate(({ key, before }) => Object.keys(localStorage).some(k => k !== key && localStorage.getItem(k)?.includes(before)), { key, before });
  140 |     expect(recovery).toBe(true);
  141 |   });
  142 |   test('S13 dirty navigation warns before leaving', async ({ page }) => {
  143 |     await boot(page, JSON.stringify([draft()]));
  144 |     let warned = false;
  145 |     page.on('dialog', async dialog => { if (dialog.type() === 'beforeunload') warned = true; await dialog.dismiss(); });
  146 |     await page.locator('#misra-input-0').fill('لمحاتی تبدیلی S13');
  147 |     await page.reload({ timeout: 3000 }).catch(() => {});
  148 |     expect(warned).toBe(true);
  149 |   });
  150 |   test('S14 a newer edit is never labelled saved before its debounce commits', async ({ page }) => {
  151 |     await boot(page, JSON.stringify([draft()]));
  152 |     await page.locator('#misra-input-0').fill('پہلی تبدیلی S14');
  153 |     await settle(page);
  154 |     await expect.poll(() => rawStore(page)).toContain('پہلی تبدیلی S14');
  155 |     await page.locator('#misra-input-0').fill('دوسری تبدیلی S14');
  156 |     await expect(page.getByText('محفوظ شدہ', { exact: true })).toHaveCount(0);
  157 |     await settle(page);
  158 |     await expect.poll(() => rawStore(page)).toContain('دوسری تبدیلی S14');
  159 |   });
  160 |   test('S15 real aborted proposal transaction must not report durable success', async ({ page }) => {
  161 |     await boot(page, JSON.stringify([draft()]));
  162 |     await page.getByRole('button', { name: 'علمِ عروض', exact: true }).click();
  163 |     await page.getByRole('button', { name: /نظمِ لغت و نظرثانی/ }).click();
  164 |     await page.getByTestId('lexicon-search').fill('آرٹ');
  165 |     await page.getByTestId('lexicon-row').filter({ hasText: 'aruuz:mastertable:513' }).getByRole('button').click();
  166 |     await page.getByTestId('proposal-pattern').fill('=-');
  167 |     await page.evaluate(() => {
  168 |       const original = IDBDatabase.prototype.transaction;
  169 |       IDBDatabase.prototype.transaction = function(...args: any[]) {
  170 |         const tx = original.apply(this, args as any);
  171 |         if (this.name === 'QalamAroozDB' && args[1] === 'readwrite') queueMicrotask(() => { try { tx.abort(); } catch {} });
  172 |         return tx;
  173 |       } as typeof original;
  174 |     });
  175 |     await page.getByTestId('proposal-save').click();
  176 |     await expect(page.getByTestId('proposal-editor')).toContainText(/نشست|مستقل ذخیرہ|session/i, { timeout: 2500 });
  177 |   });
  178 |   test('S16 deleting the active dirty draft does not resurrect it on autosave', async ({ page }) => {
  179 |     await boot(page, JSON.stringify([draft()]));
  180 |     await page.locator('#misra-input-0').fill('حذف ہونے والا S16');
  181 |     await portfolio(page);
  182 |     page.once('dialog', dialog => dialog.accept());
  183 |     await page.getByTitle('مسودہ حذف کریں').click();
  184 |     await settle(page);
  185 |     expect(JSON.parse((await rawStore(page))!)).toEqual([]);
  186 |   });
  187 |   test('S17 reload reopens the selected draft rather than drafts[0]', async ({ page }) => {
  188 |     const items = [draft('ordinary-a'), { ...draft('ordinary-b'), content: 'منتخب مسودہ S17' }];
  189 |     await boot(page, JSON.stringify(items));
  190 |     await portfolio(page);
  191 |     await page.getByRole('heading', { name: items[1].title, exact: true }).click();
  192 |     await expect(page.locator('#misra-input-0')).toHaveValue(items[1].content);
  193 |     await settle(page);
  194 |     await page.reload();
> 195 |     await expect(page.locator('#misra-input-0')).toHaveValue(items[1].content);
      |                                                  ^ Error: expect(locator).toHaveValue(expected) failed
  196 |   });
  197 | });
  198 | 
```