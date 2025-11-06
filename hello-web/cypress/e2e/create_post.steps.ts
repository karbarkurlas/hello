// @ts-nocheck

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the homepage", () => {
  cy.visit("/");
});

When(
  "I fill the form with {string}, {string}, {string}, {string}",
  (name: string, email: string, title: string, body: string) => {
    cy.get('input[placeholder="Name"]').clear().type(name);
    cy.get('input[placeholder="Email"]').clear().type(email);
    cy.get('input[placeholder="Title"]').clear().type(title);
    cy.get('textarea[placeholder="Body"]').clear().type(body);

    // kategori dropdown'u seçili değilse ilkini seç (UI'da required)
    cy.get("select").then($sel => {
      if ($sel.val() === "") {
        cy.get("select option").eq(1).then(opt => {
          const val = opt.attr("value");
          if (val) cy.get("select").select(val);
        });
      }
    });
  }
);

When("I submit the form", () => {
  cy.contains("button", "Save Post").click();
});

Then("I should see {string} in the posts list", (title: string) => {
  cy.contains("li", title, { timeout: 4000 }).should("exist");
});
