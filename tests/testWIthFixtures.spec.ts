import { expect, Page } from "@playwright/test";
import { pageManager } from "../page-object/pageManager";
import { faker } from "@faker-js/faker";
import { test } from "../tests/test-options";

test.describe("Page Object suite", () => {
  test("Fill the Grid Form", async ({ page, goToLayoutForm }) => {
    const pm = new pageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${
      faker.number.int(1000) + "@email.com"
    }`;

    await pm
      .toLayoutPageForm()
      .fillUsingTheGrid(randomEmail, "pass123", "Option 2");
  });
});
