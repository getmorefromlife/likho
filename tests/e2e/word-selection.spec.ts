import { test, expect, type Page } from '@playwright/test';
const words = ['قرار', 'بہار', 'نکھار', 'انتظار', 'دیار', 'غبار', 'پیار', 'اعتبار'];
const fixture = { id: 'word-selection', title: 'انتخاب الفاظ', poet: 'شاعر', form: 'ghazal', content: 'مرا دل مرا دل', tags: [], qafiyaList: words, createdAt: 1, updatedAt: 1 };
async function boot(page: Page, initialWords = words) {
  await page.addInitScript(draft => { localStorage.clear(); localStorage.setItem('qalam_drafts_v1', JSON.stringify([draft])); }, { ...fixture, qafiyaList: initialWords });
  await page.goto('/');
}
async function dragItems(page: Page, id: string) {
  const region = page.getByTestId(`${id}-words`);
  const chips = region.locator('[data-selectable-word]');
  await chips.first().scrollIntoViewIfNeeded();
  await expect(chips.nth(1)).toBeVisible();
  const a = (await chips.nth(0).boundingBox())!, b = (await chips.nth(1).boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByTestId(`${id}-selection-actions`)).toBeVisible();
  expect(await region.locator('[data-box-selected=true]').count()).toBeGreaterThanOrEqual(2);
}
async function copySelected(page: Page, id: string) {
  const selected = await page.getByTestId(`${id}-words`).locator('[data-box-selected=true]').evaluateAll(items => [...new Set(items.map(item => (item as HTMLElement).dataset.selectableWord!))]);
  await page.getByTestId(`${id}-selection-actions`).getByRole('button', { name: 'نقل کریں', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(selected.join('\n'));
  return selected;
}
test.beforeEach(async ({ context }) => { await context.grantPermissions(['clipboard-read', 'clipboard-write']); });

test('tray drag selects words without toggling them; copy, keyboard and filter reset', async ({ page }) => {
  await boot(page);
  await dragItems(page, 'tray');
  await expect(page.getByTestId('tray-words').locator('[data-selectable-word]').first()).not.toHaveClass(/line-through/);
  await copySelected(page, 'tray');
  await page.getByTestId('tray-selection-actions').getByRole('button', { name: 'انتخاب ختم کریں', exact: true }).click();
  await page.getByTestId('tray-words').locator('[data-selectable-word]').first().click();
  await expect(page.getByTestId('tray-words').locator('[data-selectable-word]').first()).toHaveClass(/line-through/);
  await page.getByTestId('tray-words').focus();
  await page.keyboard.press('ControlOrMeta+a');
  await expect(page.getByTestId('tray-words').locator('[data-box-selected=true]')).toHaveCount(words.length);
  await page.getByPlaceholder('تلاش کریں...', { exact: true }).fill('قرار');
  await expect(page.getByTestId('tray-selection-actions')).toHaveCount(0);
  await page.getByTestId('tray-words').focus();
  await page.keyboard.press('ControlOrMeta+a');
  await expect(page.getByTestId('tray-words').locator('[data-box-selected=true]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('tray-selection-actions')).toHaveCount(0);
});

test('treasury algorithmic and thematic lists support selection and loading only selected words', async ({ page }) => {
  await boot(page);
  await dragItems(page, 'treasury');
  const chosen = await copySelected(page, 'treasury');
  // Dragging must not trigger the existing one-word add-to-tray action.
  await expect(page.getByTestId('tray-words').locator('[data-selectable-word]')).toHaveCount(words.length);
  await page.getByTestId('treasury-selection-actions').getByRole('button', { name: 'منتخب تختی پر لائیں', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('qalam_drafts_v1')!)[0].qafiyaList)).toEqual([...new Set([...chosen, ...words])]);
  await page.getByRole('button', { name: 'موضوعاتی اوزان', exact: true }).click();
  await dragItems(page, 'thematic');
  await copySelected(page, 'thematic');
  await page.screenshot({ path: 'test-results/thematic-word-selection.png' });
});

test('dictionary synonyms, antonyms and compounds can be selected and copied together', async ({ page }) => {
  await boot(page);
  await page.getByRole('button', { name: 'لغت و الفاظ', exact: true }).click();
  await dragItems(page, 'dictionary');
  await copySelected(page, 'dictionary');
  const region = page.getByTestId('dictionary-words');
  await region.focus();
  await page.keyboard.press('ControlOrMeta+a');
  const selected = region.locator('[data-box-selected=true]');
  await expect(selected).toHaveCount(17); // 9 synonyms + 4 antonyms + 4 compounds for عشق.
  const copied = await copySelected(page, 'dictionary');
  expect(copied).toContain('محبت'); expect(copied).toContain('نفرت'); expect(copied).toContain('عشقِ حقیقی');
  await page.screenshot({ path: 'test-results/dictionary-word-selection.png' });
  await page.getByPlaceholder('لفظ تحریر کریں (مثلاً: عشق، دل، شب)...').fill('دل');
  await expect(page.getByTestId('dictionary-selection-actions')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'دل', exact: true })).toBeVisible();
});

test('slot result words allow drag and clipboard copy', async ({ page }) => {
  await boot(page);
  await page.getByRole('button', { name: /قالب ساز/ }).click();
  await dragItems(page, 'slots');
  await copySelected(page, 'slots');
});


test('tray selection auto-scrolls within its pane and works in the bottom dock too', async ({ page }) => {
  const many = Array.from({ length: 80 }, (_, i) => `قافیہ${i}`);
  await boot(page, many);
  const region = page.getByTestId('tray-words');
  const r = (await region.boundingBox())!;
  await page.mouse.move(r.x + 3, r.y + 3); await page.mouse.down();
  await page.mouse.move(r.x + r.width - 4, r.y + r.height - 4, { steps: 12 });
  await expect(region.locator('[data-box-selected=true]')).toHaveCount(80);
  await page.mouse.up();
  expect(await region.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await copySelected(page, 'tray');
  await page.getByTestId('tray-selection-actions').getByRole('button', { name: 'انتخاب ختم کریں', exact: true }).click();
  await page.getByTitle('طرزِ تقسیم اور نمونے').click();
  await page.getByRole('button', { name: 'تہہ نشین (Bottom Dock)', exact: true }).click();
  await dragItems(page, 'tray');
  await copySelected(page, 'tray');
});

test('imported rhyme preview supports selecting and copying rendered words', async ({ page }) => {
  await boot(page);
  await page.getByRole('button', { name: 'درآمد فائل 📥', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'rhymes.txt', mimeType: 'text/plain', buffer: Buffer.from(words.join('\n')) });
  await dragItems(page, 'import-preview');
  await copySelected(page, 'import-preview');
});
