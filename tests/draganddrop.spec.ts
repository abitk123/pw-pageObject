import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");
});

test.describe("Drag and Drops suite", () => {

  test("Drag and Drop test", async ({ page }) => {
    const iframe = page.frameLocator('div[rel-title="Photo Manager"] iframe');

    if(await page.locator('button p.fc-button-label').getByText('Consent').isVisible()){
        await page.locator('button p.fc-button-label').getByText('Consent').click();

    }

    await iframe.getByText("High Tatras", {exact: true}).dragTo(iframe.locator('#trash'));
    await expect(iframe.locator('#trash li h5')).toHaveText('High Tatras');


  });
});
