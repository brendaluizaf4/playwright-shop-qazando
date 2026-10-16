import { expect, test } from '@playwright/test';

const registerUrl = 'https://automationpratice.com.br/register';

test.describe('Cadastro de usuário', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(registerUrl);
    await expect(page.getByRole('heading', { name: 'Cadastro de usuário' })).toBeVisible();
  });

  test('exibe os campos necessários para cadastro', async ({ page }) => {
    await expect(page.locator('#user')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cadastrar' })).toBeVisible();
  });

  test('impede o envio quando o nome não é informado', async ({ page }) => {
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText('O campo nome deve ser prenchido')).toBeVisible();
    await expect(page).toHaveURL(registerUrl);
  });

  test('valida e-mail ausente ou inválido', async ({ page }) => {
    await page.locator('#user').fill('Usuário de teste');
    await page.locator('#email').fill('email-invalido');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText('O campo e-mail deve ser prenchido corretamente')).toBeVisible();
    await expect(page.locator('#email')).not.toHaveJSProperty('validity.valid', true);
    await expect(page).toHaveURL(registerUrl);
  });

  test('valida a senha mínima exigida', async ({ page }) => {
    await page.locator('#user').fill('Usuário de teste');
    await page.locator('#email').fill('qa@example.com');
    await page.locator('#password').fill('12345');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText('O campo senha deve ter pelo menos 6 dígitos')).toBeVisible();
    await expect(page).toHaveURL(registerUrl);
  });
});
