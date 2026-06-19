import { expect, test } from '@playwright/test';

test('deve abrir a aplicação DermaScan', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/DermaScan|DermoScan/i);
});

test('deve exibir tela de login ou autenticação', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByText(/entrar|login|e-mail|senha/i).first(),
  ).toBeVisible();
});