/// <reference types="cypress" />
import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then('I should see {string} in the posts list', (title: string) => {
  cy.get('[data-cy="postsList"] li').contains(title).should("exist");
});

import { When } from "@badeball/cypress-cucumber-preprocessor";

When(
  'I create a post with name {string}, email {string}, title {string}, body {string}',
  (name: string, email: string, title: string, body: string) => {
    cy.get('[data-cy="nameInput"]').clear().type(name);
    cy.get('[data-cy="emailInput"]').clear().type(email);
    cy.get('[data-cy="titleInput"]').clear().type(title);
    cy.get('[data-cy="bodyInput"]').clear().type(body);
    cy.contains('button', 'Save Post').click();
  }
);

export {};
