import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.URL);
});

test.describe("Ui interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("Input", async ({ page }) => {
    const emailGridBlock = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });
    await emailGridBlock.fill("mail@mail.com");
    await emailGridBlock.clear();
    await emailGridBlock.pressSequentially("mail2@mail.com", { delay: 300 });

    //general assertion
    const emailValue = await emailGridBlock.inputValue();
    expect(emailValue).toEqual("mail2@mail.com");

    //locator assertion
    await expect(emailGridBlock).toHaveValue("mail2@mail.com");
  });

  test("Checkbox", async ({ page }) => {
    const emailGridBlock = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    const radioButton = emailGridBlock.getByRole("radio", { name: "Option 1" });
    await radioButton.check({ force: true });
    const CheckStatus = await radioButton.isChecked();

    expect(CheckStatus).toBeTruthy();
    expect(radioButton).toBeChecked();

    const radioButtonSecond = emailGridBlock.getByRole("radio", {
      name: "Option 2",
    });
    await radioButtonSecond.check({ force: true });
    expect(await radioButton.isChecked()).toBeFalsy();
    await expect(radioButtonSecond).toBeChecked();
  });
});

test.describe("Ui interactions - part 2", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();
  });

  test("Checkboxes", async ({ page }) => {
    const hiddenCheckBox = page.getByRole("checkbox", {
      name: "Hide on click",
    });
    await hiddenCheckBox.check({ force: true });
    await expect(hiddenCheckBox).toBeChecked();

    await hiddenCheckBox.uncheck({ force: true });
    await expect(hiddenCheckBox).toBeChecked({ checked: false });

    const allCheckboxes = page.getByRole("checkbox");

    for (const checkbox of await allCheckboxes.all()) {
      checkbox.check({ force: true });
      await expect(checkbox).toBeChecked();
    }
  });
});

test.describe("Checklists", () => {
  test("Change the mode", async ({ page }) => {
    const selector = page.locator("ngx-header nb-select");
    await selector.click();

    // page.getByRole("listitem"); // when the list has LI tag
    // page.getByRole("list"); // when the list has UL tag

    const dropDownList = page.locator("nb-option-list nb-option");
    await expect(dropDownList).toHaveText([
      "Light",
      "Dark",
      "Cosmic",
      "Corporate",
    ]);
    await dropDownList.filter({ hasText: "Dark" }).click();

    const header = page.locator("nb-layout-header");
    await expect(header).toHaveCSS("background-color", "rgb(34, 43, 69)");

    const colors = {
      Light: "rgb(255, 255, 255)",
      Dark: "rgb(34, 43, 69)",
      Cosmic: "rgb(50, 50, 89)",
      Corporate: "rgb(255, 255, 255)",
    };

    const numberOfKeys = Object.keys(colors).length;
    let i = 0;
    await selector.click();
    for (const color in colors) {
      i++;
      await dropDownList.filter({ hasText: color }).click();
      await expect(header).toHaveCSS("background-color", colors[color]);
      if (i < numberOfKeys) {
        await selector.click();
      }
    }

    // Получаем массив пар [ключ, значение]
    const colorEntries = Object.entries(colors);
    await selector.click();
    // Выполняем действия для каждой пары
    for (let index = 0; index < colorEntries.length; index++) {
      const [color, rgb] = colorEntries[index];

      await dropDownList.filter({ hasText: color }).click();
      await expect(header).toHaveCSS("background-color", rgb);

      // Нажимаем на селектор, если не последний элемент
      if (index < colorEntries.length - 1) {
        await selector.click();
      }
    }
  });
});

test.describe("Ui interactions - 3", () => {
  test("Work with tooltip", async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Tooltip").click();

    const tooltipBlock = page.locator("nb-card", {
      hasText: "Tooltip Placements",
    });
    await tooltipBlock.locator("button", { hasText: "Top" }).hover();
    const tooltip = await page.locator("nb-tooltip").textContent();

    expect(tooltip).toEqual("This is a tooltip");
  });

  test("Work with dialog", async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

    page.on("dialog", (dialig) => {
      expect(dialig.message()).toEqual("Are you sure you want to delete?");
      dialig.accept();
    });

    const tableRow = page
      .getByRole("table")
      .locator("tr", { hasText: "mdo@gmail.com" });
    await tableRow.locator(".nb-trash").click();

    await expect(tableRow).toBeVisible({ visible: false });
  });

  test("Work with tables", async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

    //get the row
    const tableRow = page.getByRole("row", { name: "twitter@outlook.com" });
    await tableRow.locator(".nb-edit").click();

    await page.locator("input-editor").getByPlaceholder("Age").clear();
    await page.locator("input-editor").getByPlaceholder("Age").fill("35");
    await page.locator(".nb-checkmark").click();

    await expect(tableRow.getByText("35")).toBeVisible();

    const pagination = page.locator(".pagination");
    await pagination.locator("li", { hasText: "2" }).click();

    //find by id in the table

    const searchId = page
      .getByRole("row")
      .filter({ has: page.locator("td").nth(1).getByText("11") });
    await searchId.locator(".nb-edit").click();
    await page.locator("input-editor").getByPlaceholder("First Name").clear();
    await page
      .locator("input-editor")
      .getByPlaceholder("First Name")
      .fill("Oleg");
    await page.locator(".nb-checkmark").click();

    await expect(page.getByText("Oleg")).toBeVisible();

    //Loop

    const ages = ["20", "30", "40", "400"];
    for (let age of ages) {
      await page.locator("input-filter").getByPlaceholder("Age").clear();
      await page.locator("input-filter").getByPlaceholder("Age").fill(age);
      await page.waitForTimeout(500);
      const ageRows = page.locator("tbody tr");

      for (let i of await ageRows.all()) {
        if (await page.getByText("No data found").isHidden()) {
          const cellValue = await page.locator("td").last().textContent();
          expect(cellValue).toEqual(age);
        }
      }
    }
  });

  test("Work with datepickers", async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();

    const calendarInput = page.getByPlaceholder("Form Picker");
    await calendarInput.click();

    // await page.locator('nb-calendar-day-cell[class="day-cell ng-star-inserted"]').getByText("1", { exact: true}).click();

    //2 way

    let date = new Date();
    date.setDate(date.getDate() + 9);
    const expectedDate = date.getDate().toString();
    const expectedYear = date.getFullYear().toString();
    const expectedMonth = date.toLocaleString("En-US", { month: "short" });
    const expectedLongMonth = date.toLocaleString("En-US", { month: "long" });

    let dateCalendar = page
      .locator("nb-card-header nb-calendar-view-mode")
      .textContent();

    while (!(await dateCalendar).includes(expectedLongMonth)) {
      await page.locator("nb-calendar-pageable-navigation .next-month").click();
      dateCalendar = page
        .locator("nb-card-header nb-calendar-view-mode")
        .textContent();
    }

    await page
      .locator('nb-calendar-day-cell[class="day-cell ng-star-inserted"]')
      .getByText(expectedDate, { exact: true })
      .click();
    await expect(calendarInput).toHaveValue(
      `${expectedMonth} ${expectedDate}, ${expectedYear}`
    );
  });

  test("Work with slider", async ({ page }) => {

    //first option
    const temp = page.locator(
      '[tabtitle="Temperature"] ngx-temperature-dragger'
    );
    await page
      .locator('nb-tab[tabtitle="Temperature"]')
      .scrollIntoViewIfNeeded();
    const tempBlock = await temp.boundingBox();
    const x = tempBlock.x + tempBlock.width / 2;
    const y = tempBlock.y + tempBlock.height / 2;
    console.log(x, y);
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();

    //second option is changing css attribute

    const tempGuage = page.locator(
      '[tabtitle="Temperature"] ngx-temperature-dragger circle'
    );
    await tempGuage.evaluate((node) => {
      node.setAttribute("cx", "232.630");
      node.setAttribute("cy", "232.630");
    });

    await tempGuage.click();
  });

  test("Drag and Drop", async ({ page }) => {


  });
});
