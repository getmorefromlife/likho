import { test, expect, type Page } from '@playwright/test';
const draft = { id: 'writing-views', title: 'اصل عنوان', poet: 'شاعر آزمائش', form: 'ghazal', tags: [], qafiyaList: ['قرار', 'بہار'], createdAt: 1, updatedAt: 1, content: Array.from({ length: 6 }, (_, i) => `مرا دل مرا دل ${i + 1}`).join('\n') };
async function boot(page: Page) {
  await page.addInitScript(item => {
    if (!sessionStorage.getItem('writing-views-seeded')) {
      localStorage.clear();
      localStorage.setItem('qalam_drafts_v1', JSON.stringify([item]));
      sessionStorage.setItem('writing-views-seeded', '1');
    }
  }, draft);
  await page.goto('/');
}
async function view(page: Page, name: string) {
  await page.getByTitle('طرزِ تقسیم اور نمونے').click();
  await page.getByRole('button', { name, exact: true }).click();
}
const persisted = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('qalam_drafts_v1')!)[0]);

test('quiet views preserve text and rhymes, 70/30 RTL columns, reload and escape', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await boot(page);
  await page.getByPlaceholder('نیا قافیہ...').fill('نکھار');
  await page.getByRole('button', { name: 'قافیہ شامل کریں', exact: true }).click();
  await view(page, 'صرف تحریر (Writing only)');
  await expect(page.getByTestId('quiet-workspace')).toBeVisible();
  await expect(page.getByTitle('طرزِ تقسیم اور نمونے')).toHaveCount(0);
  await expect(page.getByTestId('scansion-card')).toHaveCount(0);
  await expect(page.getByLabel('خاموش تحریر')).toHaveValue(draft.content);
  const text = 'میری اپنی پہلی سطر\nمیری اپنی دوسری سطر\n\nاور تیسری سطر';
  await page.getByLabel('خاموش تحریر').fill(text);
  // Native selection spans the whole poem rather than one individual input.
  await page.getByLabel('خاموش تحریر').selectText();
  expect(await page.getByLabel('خاموش تحریر').evaluate((el: HTMLTextAreaElement) => el.value.slice(el.selectionStart, el.selectionEnd))).toBe(text);
  await page.getByRole('button', { name: 'تحریر و قوافی', exact: true }).click();
  await expect(page.getByLabel('ذاتی قوافی')).toHaveValue('نکھار\nقرار\nبہار');
  const writing = (await page.getByTestId('quiet-writing-column').boundingBox())!;
  const rhymes = (await page.getByTestId('quiet-rhyme-column').boundingBox())!;
  expect(writing.x).toBeGreaterThan(rhymes.x);
  expect(writing.width / rhymes.width).toBeCloseTo(7 / 3, 1);
  await page.getByLabel('ذاتی قوافی').fill('');
  await page.evaluate(() => navigator.clipboard.writeText('قرار\nنکھار\nچمن'));
  await page.getByLabel('ذاتی قوافی').press('ControlOrMeta+v');
  await expect.poll(() => persisted(page)).toMatchObject({ content: text, qafiyaList: ['قرار', 'نکھار', 'چمن'] });
  await page.screenshot({ path: 'test-results/quiet-rhymes.png' });
  await page.reload();
  await expect(page.getByLabel('خاموش تحریر')).toHaveValue(text);
  await expect(page.getByLabel('ذاتی قوافی')).toHaveValue('قرار\nنکھار\nچمن');
  await page.keyboard.press('Escape');
  await expect(page.locator('#misra-input-0')).toHaveValue('میری اپنی پہلی سطر');
  await expect(page.getByText('چمن', { exact: true }).first()).toBeVisible();
  await expect(page.locator('#poem-title-input')).toHaveValue(draft.title);
  await view(page, 'تحریر و قوافی (70 / 30)');
  await expect(page.getByLabel('ذاتی قوافی')).toHaveValue('قرار\nنکھار\nچمن');
  await page.getByRole('button', { name: 'صرف تحریر', exact: true }).click();
  await expect(page.getByLabel('ذاتی قوافی')).toHaveCount(0);
  await page.screenshot({ path: 'test-results/quiet-writing.png' });
  await page.getByRole('button', { name: 'اسٹوڈیو میں واپس (Esc)', exact: true }).click();
  expect(errors).toEqual([]);
});

test('mouse box selection scrolls through all lines; copy, cancel, delete and undo', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await boot(page);
  const region = page.locator('#poetry-canvas-scroll-container');
  const bounds = (await region.boundingBox())!;
  const first = (await page.locator('[data-line-index="0"]').boundingBox())!;
  await page.mouse.move(bounds.x + 5, first.y + 5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width - 8, bounds.y + bounds.height - 5, { steps: 15 });
  await expect(page.locator('[data-selected="true"]')).toHaveCount(6);
  await page.mouse.up();
  await expect(page.getByTestId('line-selection-box')).toHaveCount(0);
  await page.getByRole('button', { name: 'منتخب مصرعے نقل کریں', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(draft.content);
  await page.screenshot({ path: 'test-results/line-box-selection.png' });
  await page.getByRole('button', { name: 'انتخاب ختم کریں', exact: true }).click();
  await expect(page.locator('[data-selected="true"]')).toHaveCount(0);
  await region.focus();
  await page.keyboard.press('ControlOrMeta+a');
  await expect(page.locator('[data-selected="true"]')).toHaveCount(6);
  await page.getByRole('button', { name: 'منتخب مصرعے حذف کریں', exact: true }).click();
  await expect(page.locator('#misra-input-0')).toHaveValue('');
  await page.getByTitle('پچھلا عمل (Undo)').click();
  await expect(page.locator('#misra-input-0')).toHaveValue(draft.content.split('\n')[0]);
  await expect(page.locator('[data-line-index]')).toHaveCount(6);
  // Selecting text within an input must remain native, not start a box.
  await page.locator('#misra-input-0').selectText();
  await expect(page.getByTestId('line-selection-actions')).toHaveCount(0);
});


test('quiet view keeps phonetic typing and offers actual browser fullscreen', async ({ page }) => {
  await boot(page);
  await view(page, 'صرف تحریر (Writing only)');
  const input = page.getByLabel('خاموش تحریر');
  await input.fill('');
  await input.press('Control+Space');
  await input.pressSequentially('ab');
  await expect(input).toHaveValue('اب');
  await input.press('Control+Space');
  await page.getByRole('button', { name: 'پوری سکرین', exact: true }).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await page.getByRole('button', { name: 'اسٹوڈیو میں واپس (Esc)', exact: true }).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  await expect(page.locator('#misra-input-0')).toHaveValue('اب');
});
