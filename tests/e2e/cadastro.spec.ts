import { test, expect } from '@playwright/test';

test.describe('Cadastro de usuário', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('exibe erro quando o formulário é enviado vazio', async ({ page }) => {
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText('O campo nome deve ser prenchido')).toBeVisible();
  });

  test('exibe erro para e-mail em formato inválido', async ({ page }) => {
    const campos = page.getByRole('textbox');
    await campos.nth(0).fill('Cliente Teste');
    await campos.nth(1).fill('email-invalido');
    await campos.nth(2).fill('Senha123');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText('O campo e-mail deve ser prenchido corretamente')).toBeVisible();
  });

  test('cadastra usuário com dados válidos', async ({ page }) => {
    const campos = page.getByRole('textbox');
    await campos.nth(0).fill(`Cliente ${Date.now()}`);
    await campos.nth(1).fill(`cliente-${Date.now()}@example.com`);
    await campos.nth(2).fill('Senha123');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page).toHaveURL(/\/my-account\/?$/);
  });
});