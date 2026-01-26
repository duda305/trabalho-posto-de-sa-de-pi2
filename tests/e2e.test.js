import { test, expect } from '@playwright/test';

test.describe('E2E - Posto de Saúde', () => {

  // ======================
  // LOGIN
  // ======================

  test('Login inválido deve exibir mensagem de erro', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'errado@email.com');
    await page.fill('input[name="senha"]', 'senha_errada');
    await page.click('button[type="submit"]');

    await expect(
      page.locator('.error, .alert, .mensagem-erro')
    ).toBeVisible();
  });

  test('Login válido deve redirecionar o usuário', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'usuario@email.com');
    await page.fill('input[name="senha"]', 'senha_valida');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard|home/);
  });

  // ======================
  // CADASTRO
  // ======================

  test('Cadastro válido deve ser realizado com sucesso', async ({ page }) => {
    await page.goto('http://localhost:3000/cadastro');

    await page.fill('input[name="nome"]', 'Usuário Teste');
    await page.fill(
      'input[name="email"]',
      `teste${Date.now()}@email.com`
    );
    await page.fill('input[name="senha"]', '123456');
    await page.click('button[type="submit"]');

    await expect(
      page.locator('.success, .alert-success, .mensagem-sucesso')
    ).toBeVisible();
  });

  test('Cadastro sem dados deve exibir erro', async ({ page }) => {
    await page.goto('http://localhost:3000/cadastro');

    await page.click('button[type="submit"]');

    await expect(
      page.locator('.error, .alert-danger, .mensagem-erro')
    ).toBeVisible();
  });

});
