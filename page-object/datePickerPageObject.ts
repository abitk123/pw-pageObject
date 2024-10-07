import { expect, test, Page, Locator } from "@playwright/test";

export class DatePickerForm {
  readonly page: Page;
  readonly calendarInput: Locator;
  readonly rangePicker: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calendarInput = this.page.getByPlaceholder("Form Picker");
    this.rangePicker = this.page.getByPlaceholder("Range Picker");
  }

  async commonLogicDatePicker(dateAfterToday: number) {
    await this.calendarInput.click();
    const dateToAssert = await this.selectTheDate(dateAfterToday, 1);

    await expect(this.calendarInput).toHaveValue(dateToAssert);
  }

  async selectDatepickerWithRange(
    startDateAfterToday: number,
    lastDateAfterToday: number
  ) {
    await this.rangePicker.click();
    const dateToAssertStart = await this.selectTheDate(startDateAfterToday, 2);
    const dateToAssertLast = await this.selectTheDate(lastDateAfterToday, 2);
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertLast}`;

    await expect(this.rangePicker).toHaveValue(dateToAssert);
  }

  private async selectTheDate(dateAfterToday: number, calendarType: number) {
    let date = new Date();
    date.setDate(date.getDate() + dateAfterToday);
    const expectedDate = date.getDate().toString();
    const expectedYear = date.getFullYear().toString();
    const expectedMonth = date.toLocaleString("En-US", { month: "short" });
    const expectedLongMonth = date.toLocaleString("En-US", { month: "long" });

    let dateCalendar = await this.page
      .locator("nb-card-header nb-calendar-view-mode")
      .textContent();

      const expectedMonthAndYear = `${expectedLongMonth} ${expectedYear}`

    while (!(dateCalendar).includes(expectedMonthAndYear)) {
      await this.page
        .locator("nb-calendar-pageable-navigation .next-month")
        .click();
      dateCalendar = await this.page
        .locator("nb-card-header nb-calendar-view-mode")
        .textContent();
    }

    if (calendarType == 1) {
      await this.page
        .locator('*[class="day-cell ng-star-inserted"]')
        .getByText(expectedDate, { exact: true })
        .click();
    } else if (calendarType == 2) {
      await this.page
        .locator('nb-calendar-range-day-cell[class="range-cell day-cell ng-star-inserted"]')
        .getByText(expectedDate, { exact: true })
        .click();
    }

    return `${expectedMonth} ${expectedDate}, ${expectedYear}`;
  }
}
