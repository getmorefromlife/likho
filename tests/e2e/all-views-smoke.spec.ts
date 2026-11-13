import { expect, test } from '@playwright/test';

test('all main views, dropdowns, companion tabs, modals, and Voice Studio render with zero runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        !text.includes('fonts.gstatic.com') &&
        !text.includes('ERR_FAILED') &&
        !text.includes('503 (Offline)')
      ) {
        errors.push(`console.error: ${text}`);
      }
    }
  });

  await page.goto('/');
  await expect(page.locator('h1', { hasText: 'سخن' })).toBeVisible();

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
    if (vName === 'صرف تحریر (Writing only)' || vName === 'تحریر و قوافی (70 / 30)') {
      await expect(page.getByTestId('quiet-workspace')).toBeVisible();
      await page.getByRole('button', { name: 'اسٹوڈیو میں واپس (Esc)', exact: true }).click();
      await expect(page.getByTitle('طرزِ تقسیم اور نمونے')).toBeVisible();
    } else if (vName === 'من پسند (Custom Studio)') {
      await expect(page.getByText('من پسند اسٹوڈیو')).toBeVisible();
      await page.getByRole('button', { name: 'کلاسیکی منظر', exact: true }).click();
      await expect(page.getByTitle('طرزِ تقسیم اور نمونے')).toBeVisible();
    }
  }

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
  await page.getByRole('button', { name: 'بند کریں', exact: true }).click();

  // 4. Test File & Export Dropdown -> Export Modal -> Diwan Booklet (WhatsApp 9:16) & Karachi Publishing Desk
  await page.getByRole('button', { name: /فائل و اشاعت/ }).click();
  await page.getByRole('button', { name: /برآمد و دیوان کتابچہ/ }).click();
  await expect(page.getByText(/برآمد/).first()).toBeVisible();
  await page.getByRole('button', { name: 'بند کریں', exact: true }).click();

  // 5. Test Voice & Mushaira Studio Page (ترنم اسٹوڈیو)
  await page.getByRole('button', { name: /ترنم اسٹوڈیو/ }).first().click();
  await expect(page.getByRole('button', { name: /کینوس پر واپسی/ })).toBeVisible();
  await expect(page.getByText(/آٹو ڈکنگ/).first()).toBeVisible();
  await expect(page.getByText(/بیک گراؤنڈ موسیقی/).first()).toBeVisible();
  await page.getByRole('button', { name: /کینوس پر واپسی/ }).click();
  await expect(page.locator('#poem-title-input')).toBeVisible();

  expect(errors).toEqual([]);
});

