import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('exibe erro ao enviar o formulário vazio', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('E-mail inválido.')).toBeVisible();
  });

  test('exibe erro para e-mail em formato inválido', async ({ page }) => {
    await page.getByRole('textbox').nth(0).fill('email-invalido');
    await page.getByRole('textbox').nth(1).fill('Senha123');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('E-mail inválido.')).toBeVisible();
  });

  test('exibe erro quando a senha não é informada', async ({ page }) => {
    await page.getByRole('textbox').nth(0).fill(`usuario-${Date.now()}@example.com`);
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('Senha inválida.')).toBeVisible();
  });

  test('redireciona quando os dois campos são preenchidos', async ({ page }) => {
    await page.getByRole('textbox').nth(0).fill(`usuario-${Date.now()}@example.com`);
    await page.getByRole('textbox').nth(1).fill('Senha123');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page).toHaveURL(/\/my-account\/?$/);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login realizado' })).toBeVisible();
  });

  test('rejeita credenciais com senha incorreta', async ({ page }) => {
    test.fail(true, 'O site aceita senha incorreta e redireciona para /my-account.');

    await page.getByRole('textbox').nth(0).fill(`usuario-${Date.now()}@example.com`);
    await page.getByRole('textbox').nth(1).fill('senha-incorreta');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page).toHaveURL(/\/login\/?$/);
    await expect(page.getByText('Senha inválida.')).toBeVisible();
  });
});