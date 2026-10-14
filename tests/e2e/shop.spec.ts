import { test, expect } from '@playwright/test';

test.describe('Loja, carrinho e checkout', () => {
  test('lista produtos disponíveis na loja', async ({ page }) => {
    await page.goto('/shop');

    await expect(page.getByRole('heading', { name: 'Green Dress For Woman' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'T-Shirt For Men' })).toBeVisible();
  });

  test('busca produtos e exibe confirmação', async ({ page }) => {
    await page.goto('/shop');
    await page.getByRole('link', { name: 'img' }).first().click();
    await page.getByRole('searchbox', { name: 'type keyword(s) here' }).fill('Green Dress');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Check out the Results')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('heading', { name: 'Green Dress For Woman' })).toBeVisible();
  });

  test('não envia a busca sem um termo', async ({ page }) => {
    await page.goto('/shop');
    await page.getByRole('link', { name: 'img' }).first().click();
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page).toHaveURL(/\/shop#search$/);
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('abre o checkout a partir do carrinho', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.getByRole('heading', { name: 'Cart Total' })).toBeVisible();
    await page.getByRole('link', { name: 'Proceed to Checkout' }).click();

    await expect(page).toHaveURL(/\/checkout-one\/?$/);
    await expect(page.getByRole('heading', { name: 'Billings Information' })).toBeVisible();
  });

  test('salva os dados de cobrança no checkout', async ({ page }) => {
    await page.goto('/checkout-one');
    await page.getByRole('textbox', { name: 'First name*' }).fill('Cliente');
    await page.getByRole('textbox', { name: 'Last name*' }).fill('Teste');
    await page.getByRole('textbox', { name: 'Company Name*' }).fill('Empresa Teste');
    await page.getByRole('textbox', { name: 'Email Addresse*' }).fill(`checkout-${Date.now()}@example.com`);
    await page.getByLabel('Country*').selectOption('usa');
    await page.getByLabel('State/City*').selectOption('Aland Islands');
    await page.getByRole('textbox', { name: 'Zip Code*' }).fill('12345');
    await page.getByRole('textbox', { name: 'Full Address*' }).fill('Rua de Teste, 123');
    await page.getByRole('textbox', { name: 'Additional Notes*' }).fill('Entrega em horário comercial');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Billings Information registred with success!' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First name*' })).toBeDisabled();
  });
});