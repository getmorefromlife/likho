import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function openReview(page: Page) {
  await page.getByRole('button', { name: 'علمِ عروض', exact: true }).click();
  await page.getByRole('button', { name: /نظمِ لغت و نظرثانی/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}
async function findArt(page: Page) {
  await page.getByRole('button', { name: /قرنطینہ شدہ الفاظ/ }).click();
  await page.getByTestId('lexicon-search').fill('آرٹ');
  const row = page.getByTestId('lexicon-row').filter({ hasText: 'likho:quarantine:513' });
  await expect(row).toHaveCount(1);
  return row;
}
async function editArt(page: Page) {
  const row = await findArt(page);
  await row.getByRole('button').click();
  await expect(page.getByTestId('proposal-editor')).toBeVisible();
}
async function save(page: Page, approved: boolean) {
  await page.getByTestId('proposal-pattern').fill('=-');
  await page.getByRole('button', { name: approved ? /مصدقہ \(Approved\)/ : /Unreviewed Draft/ }).click();
  await page.getByTestId('proposal-save').click();
  await expect(page.getByTestId('proposal-editor')).toBeHidden();
}
async function closeReview(page: Page) {
  await page.getByRole('dialog').getByRole('button', { name: 'بند کریں', exact: true }).last().click();
  await expect(page.getByRole('dialog')).toBeHidden();
}
async function exported(page: Page) {
  const pending = page.waitForEvent('download');
  await page.getByTestId('lexicon-export').click();
  const download = await pending;
  return JSON.parse(await readFile((await download.path())!, 'utf8'));
}
async function importJSON(page: Page, data: unknown) {
  await page.getByRole('button', { name: 'درآمد و برآمد (TSV / JSON)', exact: true }).click();
  await page.getByRole('button', { name: 'JSON ڈیٹا', exact: true }).click();
  await page.getByTestId('lexicon-import-text').fill(JSON.stringify(data));
  await page.getByTestId('lexicon-import').click();
}

test('A–H: quarantine review, live repair eligibility, real storage and backup integrity', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const card = page.getByTestId('scansion-card').first();
  await test.step('A–B: open modal, source search and reason filter', async () => {
    await openReview(page);
    await expect(page.getByRole('button', { name: /قرنطینہ شدہ الفاظ \(2\)/ })).toBeVisible();
    await findArt(page);
    await expect(page.getByTestId('lexicon-row').filter({ hasText: 'likho:quarantine:513' })).toContainText('پیچیدہ');
    await page.getByTestId('lexicon-search').fill('513');
    await expect(page.getByTestId('lexicon-row').filter({ hasText: 'likho:quarantine:513' })).toBeVisible();
    await page.getByTestId('lexicon-search').fill('');
    await page.getByTestId('reason-filter').selectOption('impossible-exception');
    await expect(page.getByTestId('lexicon-row')).toHaveCount(1);
    await page.getByTestId('reason-filter').selectOption('all');
  });
  await test.step('C: invalid patterns rejected without saving', async () => {
    await editArt(page);
    for (const pattern of ['abc', 'xxxxxxxxx']) {
      await page.getByTestId('proposal-pattern').fill(pattern);
      await page.getByTestId('proposal-save').click();
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByTestId('proposal-editor')).toBeVisible();
    }
  });
  await test.step('D: draft persists after reload and blocks repairs', async () => {
    await save(page, false);
    await closeReview(page);
    await page.locator('#misra-input-0').fill('آرٹ میرا دل مرا دل مرا دل');
    await page.getByLabel('مطلوبہ بحر', { exact: true }).first().selectOption('mutaqarib-musamman-salim');
    await expect(card).toContainText('تلفظ کی تصدیق درکار');
    await expect(card.getByTestId('repair-suggestion')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('qalam_drafts_v1'))).toContain('آرٹ میرا دل مرا دل مرا دل');
    await page.reload();
    await expect(page.locator('#misra-input-0')).toHaveValue('آرٹ میرا دل مرا دل مرا دل');
    await openReview(page);
    await expect(await findArt(page)).toContainText('زیرِ جائزہ (مسودہ)');
    await closeReview(page);
    await page.getByLabel('مطلوبہ بحر', { exact: true }).first().selectOption('mutaqarib-musamman-salim');
    await expect(card).toContainText('تلفظ کی تصدیق درکار');
  });
  await test.step('E: approve updates existing canvas and enables an applied repair', async () => {
    await openReview(page);
    await editArt(page);
    await save(page, true);
    await page.getByRole('button', { name: /مصدقہ ذاتی اوزان/ }).click();
    await expect(page.getByTestId('lexicon-row')).toContainText('مصدقہ (فعال)');
    await page.screenshot({ path: 'test-results/lexicon-approved.png' });
    await closeReview(page);
    await expect(card).not.toContainText('تلفظ کی تصدیق درکار');
    await expect(card.getByTestId('word-reading').filter({ hasText: 'آرٹ' })).toContainText('=-');
    await card.getByRole('button', { name: /اصلاحِ بحر/ }).click();
    await expect(card).toContainText('میرا');
    await expect(card).toContainText('مرا');
    await card.getByTestId('repair-suggestion').filter({ hasText: 'میرا ← مرا' }).getByRole('button', { name: 'جزوی بہتری لاگو کریں', exact: true }).click();
    await expect(page.locator('#misra-input-0')).toHaveValue('آرٹ مرا دل مرا دل مرا دل');
    await page.screenshot({ path: 'test-results/lexicon-repair-applied.png' });
    await openReview(page);
  });
  let backup: any;
  await test.step('G export: real download preserves approved proposal', async () => {
    backup = await exported(page);
    expect(backup.schemaVersion).toBe(2);
    expect(backup.proposals['آرٹ']).toMatchObject({ word: 'آرٹ', pattern: '=-', status: 'approved' });
    await page.reload();
    await openReview(page);
    await expect(await findArt(page)).toContainText('مصدقہ (فعال)');
  });
  await test.step('F: delete immediately revokes reading and repair eligibility', async () => {
    await closeReview(page);
    await page.locator('#misra-input-0').fill('آرٹ میرا دل مرا دل مرا دل');
    await page.getByLabel('مطلوبہ بحر', { exact: true }).first().selectOption('mutaqarib-musamman-salim');
    await openReview(page);
    await editArt(page);
    await page.getByTestId('proposal-delete').click();
    await expect(page.getByTestId('proposal-editor')).toBeHidden();
    await closeReview(page);
    await expect(card).toContainText('تلفظ کی تصدیق درکار');
    await expect(card).toContainText('?');
    await expect(card.getByTestId('repair-suggestion')).toHaveCount(0);
    await page.reload();
    await openReview(page);
    expect((await exported(page)).proposals['آرٹ']).toBeUndefined();
  });
  await test.step('G import: restore downloaded JSON and persist approval across reload', async () => {
    await importJSON(page, backup);
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('محفوظ ہو گئے');
    expect((await exported(page)).proposals['آرٹ']).toEqual(backup.proposals['آرٹ']);
    await page.reload();
    await openReview(page);
    await expect(await findArt(page)).toContainText('مصدقہ (فعال)');
    await closeReview(page);
    await page.locator('#misra-input-0').fill('آرٹ میرا دل مرا دل مرا دل');
    await page.getByLabel('مطلوبہ بحر', { exact: true }).first().selectOption('mutaqarib-musamman-salim');
    await expect(card).not.toContainText('تلفظ کی تصدیق درکار');
    await openReview(page);
  });
  await test.step('H: malformed imports leave memory and real IndexedDB unchanged', async () => {
    const before = await exported(page);
    const broken = structuredClone(before);
    broken.proposals['آرٹ'].status = 'unreviewed';
    broken.proposals['گل'] = { word: 'گل', pattern: 'xxxxxxxxx', status: 'approved' };
    await importJSON(page, broken);
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('درآمد میں خرابی');
    expect(await exported(page)).toEqual(before);
    await page.reload();
    await openReview(page);
    expect(await exported(page)).toEqual(before);
  });
  expect(errors).toEqual([]);
  await closeReview(page);
  await page.screenshot({ path: 'test-results/lexicon-acceptance.png', fullPage: true });
});
