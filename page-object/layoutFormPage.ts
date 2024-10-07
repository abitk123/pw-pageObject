import { expect, test, Page, Locator } from "@playwright/test";

export class LayoutPageForm {
    readonly page: Page;
    readonly usingGrid: Locator;

    constructor(page : Page){
        this.page = page;
        this.usingGrid = this.page.locator('.col-md-6', {hasText: "Using the Grid"})
    }
    /**
     * 
     * @param email 
     * @param password 
     * @param radioButtonText 
     */
    async fillUsingTheGrid(email: string, password: string, radioButtonText: string){
        await this.usingGrid.getByPlaceholder("Email").fill(email);
        await this.usingGrid.getByPlaceholder("Password").fill(password);
        await this.usingGrid.getByText(radioButtonText, {exact: true}).check();
        await this.usingGrid.getByText('Sign in').click()
    }
}