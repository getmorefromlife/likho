import { expect, test } from '@playwright/test';

test('all main views, dropdowns, companion tabs, modals, and Voice Studio render with zero runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`console.error: ${msg.text()}`);
    }
  });

  await page.goto('/');
  await expect(page.locator('h1', { hasText: 'قلم و قافیہ' })).toBeVisible();

  // 1. Test Layout Views via TopNavBar dropdown ("طرزِ تقسیم اور نمونے")
  const viewNames = [
    'کلاسیکی (Classic)',
    'تحریر و قوافی (70 / 30)',
    'معکوس (Swapped)',
    'تہہ نشین (Bottom Dock)',
    'صرف تحریر (Writing only)',
    'من پسند (Custom Studio)',
  ];

  for (const vName of viewNames) {
    await page.getByTitle('طرزِ تقسیم اور نمونے').click();
    await page.getByRole('button', { name: vName, exact: true }).last().click();
    if (vName === 'صرف تحریر (Writing only)') {
      await expect(page.locator('#poem-title-input')).toBeVisible();
      await page.keyboard.press('Escape');
    } else if (vName === 'من پسند (Custom Studio)') {
      await expect(page.getByText('من پسند اسٹوڈیو')).toBeVisible();
    }
  }

  // Return to Classic 70/30 view
  await page.getByTitle('طرزِ تقسیم اور نمونے').click();
  await page.getByRole('button', { name: 'کلاسیکی (Classic)', exact: true }).last().click();

  // 2. Test all 5 Literary Companion Tabs
  const companionTabs = [
    'خزانہ قوافی',
    'علمِ عروض',
    'لغت و الفاظ',
    'صنائع بدائع',
    'دیوانِ کلام',
  ];
  for (const tabLabel of companionTabs) {
    await page.getByRole('button', { name: tabLabel }).first().click();
  }

  // 3. Test File & Export Dropdown -> Google Drive Backup Modal
  await page.getByRole('button', { name: /فائل و اشاعت/ }).click();
  await page.getByRole('button', { name: /گوگل ڈرائیو و دستاویز/ }).click();
  await expect(page.getByText(/گوگل ڈرائیو/).first()).toBeVisible();
  await page.keyboard.press('Escape');

  // 4. Test File & Export Dropdown -> Export Modal -> Diwan Booklet (WhatsApp 9:16) & Karachi Publishing Desk
  await page.getByRole('button', { name: /فائل و اشاعت/ }).click();
  await page.getByRole('button', { name: /برآمدگی و کتابت/ }).click();
  await expect(page.getByText(/برآمدگی/).first()).toBeVisible();
  await page.keyboard.press('Escape');

  // 5. Test Voice & Mushaira Studio Page (ترنم اسٹوڈیو)
  await page.getByRole('button', { name: /ترنم اسٹوڈیو/ }).click();
  await expect(page.getByText('مشاعرہ و ترنم اسٹوڈیو')).toBeVisible();
  await expect(page.getByText(/آٹو ڈکنگ/).first()).toBeVisible();
  await expect(page.getByText(/بیک گراؤنڈ موسیقی/).first()).toBeVisible();
  await page.getByRole('button', { name: /کینوس پر واپسی/ }).click();
  await expect(page.locator('#poem-title-input')).toBeVisible();

  expect(errors).toEqual([]);
});

