import { chromium, expect } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const pageSetup = await browser.newPage();
  await pageSetup.goto("https://admin-staging.admin.com/signin");
  await pageSetup.waitForTimeout(6000);

  await pageSetup.getByPlaceholder("Username").click();
  await pageSetup.getByPlaceholder("Username").type("secretsecret");
  await pageSetup.getByPlaceholder("Password").click();
  await pageSetup.getByPlaceholder("Password").type("password123");
  await pageSetup.getByRole("button", { name: "Signin" }).click();

  await pageSetup.waitForTimeout(4000);
  await expect(pageSetup.locator("text=admin88")).toBeVisible();

  await pageSetup.context().storageState({ path: "localstorage.json" });
  await browser.close();
}

export default globalSetup;
