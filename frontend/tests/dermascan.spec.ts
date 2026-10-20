import { expect, test } from "@playwright/test";

test("deve abrir a aplicação DermaScan", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/DermaScan|DermoScan/i);
});

test("deve exibir a landing page pública", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).toContainText(/DermaScan/i);

  await expect(
    page.getByRole("button", { name: /^Entrar$/i }).first(),
  ).toBeVisible();
});

test("deve abrir o modal de login ao clicar em Entrar", async ({ page }) => {
  await page.goto("/");

  const botaoEntrar = page.getByRole("button", { name: /^Entrar$/i }).first();

  await expect(botaoEntrar).toBeVisible();
  await botaoEntrar.click();

  await expect(page.locator('input[type="email"]').first()).toBeVisible();
});
