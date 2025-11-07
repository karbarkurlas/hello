/// <reference types="cypress" />
import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then('I should see a team named {string}', (name: string) => {
  cy.get('[data-cy="teamsList"]').contains(name).should('exist');
});

Then('I should see a shift row containing {string}', (text: string) => {
  cy.get('[data-cy="shiftsList"]').contains(text).should('exist');
});

Then('I should see an assignment row containing {string}', (text: string) => {
  cy.get('[data-cy="assignmentsList"]').contains(text).should('exist');
});

Then('I should see a leave row containing {string}', (text: string) => {
  cy.get('[data-cy="leavesList"]').contains(text).should('exist');
});

export {};

