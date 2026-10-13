import { expect, test } from '@playwright/test';

const baseUrl = 'https://automationpratice.com.br';

test.describe('Carrinho de compras', () => {
  test('incrementa a quantidade quando um produto é adicionado', async ({ page }) => {
    await page.goto(`${baseUrl}/product-details-one/1`);

    const productDetails = page.locator('.modal_product_content_one');
    const cartCount = page.locator('ul.header-action-link').first().locator('.item-count').nth(1);

    await expect(productDetails).toBeVisible();
    await expect(cartCount).toHaveText(/^\d+$/);
    const initialCount = Number(await cartCount.innerText());

    await productDetails.locator('select').selectOption('xl');
    await productDetails.getByRole('link', { name: 'ADD TO CART' }).click();

    await expect(cartCount).toHaveText(String(initialCount + 1));
  });
});
