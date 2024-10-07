import { expect, test, Page } from "@playwright/test";
import { NavigationPage } from "./navigation";
import { LayoutPageForm } from "./layoutFormPage";
import { DatePickerForm } from "./datePickerPageObject";

export class pageManager {
  private readonly page: Page;
  private readonly navigationPage: NavigationPage;
  private readonly layoutPageForm: LayoutPageForm;
  private readonly datePickerForm: DatePickerForm;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.layoutPageForm = new LayoutPageForm(this.page);
    this.datePickerForm = new DatePickerForm(this.page);
  }

  toNavigationPage() {
    return this.navigationPage;
  }

  toLayoutPageForm() {
    return this.layoutPageForm;
  }
  toDatePickerForm() {
    return this.datePickerForm;
  }
}
