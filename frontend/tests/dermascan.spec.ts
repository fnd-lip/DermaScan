import { expect, test } from "@playwright/test";

test("deve abrir a aplicação DermaScan", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/DermaScan|DermoScan/i);
});

test("deve exibir a landing page pública", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText(/A IA que estende sua visão dermatológica/i),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: /Acessar sistema/i }),
  ).toBeVisible();
});

test("deve abrir o modal de login ao clicar em acessar sistema", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Acessar sistema/i }).click();

  await expect(page.getByPlaceholder(/e-mail/i)).toBeVisible();

  await expect(page.getByText(/senha de acesso/i)).toBeVisible();

  await expect(
    page.getByRole("button", { name: /Entrar no Workspace/i }),
  ).toBeVisible();
});
