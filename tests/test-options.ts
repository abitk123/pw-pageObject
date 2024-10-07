import { test as base } from "@playwright/test";

export type TestOptions = {
  globalsQaUrl: string;
  goToLayoutForm: string;
};

export const test = base.extend<TestOptions>({
  globalsQaUrl: ["", { option: true }],

  goToLayoutForm: [async ({ page }, use) => {
    await page.goto(process.env.URL);
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
    await use("");
  }, {auto: true}]
});
