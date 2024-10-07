import { expect, test, Page } from "@playwright/test";
import { pageManager } from "../page-object/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.URL);
});

test.describe("Page Object suite", () => {
  test("Navigate to Form Page", async ({ page }) => {
    const pm = new pageManager(page);
    await pm.toNavigationPage().pageLayoutPage();
    await pm.toNavigationPage().pageDatepickerPage();
    await pm.toNavigationPage().pageLayoutPage();
    await pm.toNavigationPage().popOverPage();
    await pm.toNavigationPage().toastrPage();
    await pm.toNavigationPage().tooltipPage();
    await pm.toNavigationPage().windowPage();
  });

  test("Fill the Grid Form", async ({ page }) => {
    const pm = new pageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)+"@email.com"}`

    await pm.toNavigationPage().pageLayoutPage();
    await pm.toLayoutPageForm().fillUsingTheGrid(
      randomEmail,
      "pass123",
      "Option 2"
    );
  });

  test("DatePicker test", async ({ page }) => {
    const pm = new pageManager(page);
    await pm.toNavigationPage().pageDatepickerPage();
    await pm.toDatePickerForm().commonLogicDatePicker(7);
    await pm.toDatePickerForm().selectDatepickerWithRange(3, 7);
  });
});
