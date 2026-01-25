import { test, expect } from '@playwright/test';
import crypto from 'crypto';

function createValidUser() {
  const hash = crypto.randomBytes(10).toString('hex');

  return {
    name: `User ${hash}`,
    email: `user-${hash}@email.com`,
    password: '12345678',
  };
}

test.describe('Posto de Saúde', () => {
  let user;

  test.beforeAll(() => {
    user = createValidUser();
  });

  test('deve cadastrar e fazer login', async ({ page }) => {
    // CADASTRO
    await page.goto('/signup.html');

    await page.getByRole('textbox', { name: /nome/i }).fill(user.name);
    await page.getByRole('textbox', { name: /email/i }).fill(user.email);

    await page.getByRole('textbox', { name: /^senha$/i }).fill(user.password);
    await page
      .getByRole('textbox', { name: /confirmar senha/i })
      .fill(user.password);

    await page.getByRole('button', { name: /cadastrar/i }).click();

    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();

    // LOGIN
    await page.goto('/signin.html');

    await page.getByRole('textbox', { name: /email/i }).fill(user.email);
    await page.getByRole('textbox', { name: /senha/i }).fill(user.password);

    await page.getByRole('button', { name: /entrar/i }).click();

    // HOME / DASHBOARD
    await expect(
      page.getByRole('heading', { name: /home|início|posto|painel|dashboard/i })
    ).toBeVisible();
  });
});
