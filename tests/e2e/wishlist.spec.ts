import { expect, test } from '@playwright/test';

const baseUrl = 'https://automationpratice.com.br';

test.describe('Wishlist', () => {
  test('incrementa a quantidade quando um produto é adicionado', async ({ page }) => {
    await page.goto(`${baseUrl}/shop`, { waitUntil: 'domcontentloaded' });

    const product = page.locator('.product_wrappers_one').filter({ hasText: 'Green Dress For Woman' }).first();
    const wishlistCount = page.locator('ul.header-action-link').first().locator('.item-count').first();

    await expect(product).toBeVisible();
    await expect(wishlistCount).toHaveText(/^\d+$/);
    const initialCount = Number(await wishlistCount.innerText());

    await product.hover();
    await product.locator('a.action.wishlist').click();

    await expect(wishlistCount).toHaveText(String(initialCount + 1));
  });
});
