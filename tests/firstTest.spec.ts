import { expect, test } from "@playwright/test";

test.describe("First suit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.URL);
    await page.getByText("Forms").click();
  });

  test("The first test", async ({ page }) => {
    await page.getByText("Form Layouts").click();

    await expect(page.getByText("Inline form")).toBeVisible();
  });

  test("Navigation to datepicker", async ({ page }) => {
    await page.getByText("Datepicker").click();

    await expect(page.getByText("Common Datepicker")).toBeVisible();
  });

  test("Locator using", async ({ page }) => {
    await page.getByRole("button", { name: "Light" }).click();
    await page.getByText("Dark").click();

    await expect(page.getByRole("button", { name: "Dark" })).toBeVisible();
  });

  test("Locator using 2", async ({ page }) => {
    await page.getByText("Form Layouts").click();
    await page
      .locator("nb-card", { hasText: "Basic form" })
      .getByPlaceholder("Email")
      .fill("Test");
    await page
      .locator("nb-card", { hasText: "Basic form" })
      .getByPlaceholder("Password")
      .fill("Pass");
    await page
      .locator("nb-card", { hasText: "Basic form" })
      .getByRole("button")
      .click();
  });

  test("Extracting values", async ({ page }) => {
    await page.getByText("Form Layouts").click();

    const email = "test@test.com";
    const basicForm = page.locator("nb-card", { hasText: "Basic form" });
    const buttonText = await basicForm.locator("button").textContent();

    expect(buttonText).toEqual("Submit");

    const inputEmail = basicForm.getByRole("textbox", { name: "Email" });
    await inputEmail.fill(email);
    expect(await inputEmail.inputValue()).toEqual(email);

    const attrValue = await inputEmail.getAttribute("placeholder");
    expect(attrValue).toEqual("Email");
  });

  test("Assertions", async ({ page }) => {
    await page.getByText("Form Layouts").click();
    //General assertions

    const basicForm = page.locator("nb-card", { hasText: "Using the Grid" });
    const radioButtons = basicForm.getByRole("radio");

    await expect(radioButtons).toHaveCount(3);

    //Locator assertions

    await expect(basicForm.getByRole('button')).toHaveText("Sign in");

    //Soft assertion

    await expect.soft(basicForm.getByRole('button')).toHaveText("Sign in");
    await basicForm.getByRole('button').click();



  });
});
