import { expect, test, Page } from "@playwright/test";

export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async pageLayoutPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
  }

  async pageDatepickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }
  async dialogPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
  }

  async windowPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Window").click();
  }

  async popOverPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Popover").click();
  }
  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click();
  }
  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  private async selectGroupMenuItem(title: string) {
    const menuItem = this.page.getByTitle(title, {exact: true});
    const attrValue = await menuItem.getAttribute("aria-expanded");
    if (attrValue == "false") {
      await menuItem.click();
    }
  }
}
