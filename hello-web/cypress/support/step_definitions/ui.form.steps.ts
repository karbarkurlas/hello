/// <reference types="cypress" />
import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

function selectorFor(label: string): string {
  const key = label.toLowerCase().trim();
  if (key === "name") return '[data-cy="nameInput"]';
  if (key === "email") return '[data-cy="emailInput"]';
  if (key === "title") return '[data-cy="titleInput"]';
  if (key === "body") return '[data-cy="bodyInput"]';
  // New fields
  if (key === "team name") return '[data-cy="teamNameInput"]';
  if (key === "shift date") return '[data-cy="shiftDateInput"]';
  if (key === "shift start") return '[data-cy="shiftStartInput"]';
  if (key === "shift end") return '[data-cy="shiftEndInput"]';
  if (key === "leave date") return '[data-cy="leaveDateInput"]';
  if (key === "leave start") return '[data-cy="leaveStartInput"]';
  if (key === "leave end") return '[data-cy="leaveEndInput"]';
  if (key === "reason") return '[data-cy="leaveReasonInput"]';
  throw new Error(`Unknown field label: ${label}`);
}

When('I type {string} into the {string} field', (value: string, label: string) => {
  cy.get(selectorFor(label)).should("exist").clear().type(value);
});

// <-- BU YENİ: "I click the "Save Post" button"
When('I click the {string} button', (text: string) => {
  cy.contains('button, [role="button"]', text).should('be.visible').click();
});

// Eski feature'lar için eşanlamlı (kalsın)
When('I press {string}', (text: string) => {
  cy.contains('button, [role="button"]', text).should('be.visible').click();
});

// Parametreli sürüm (feature'da URL verildiğinde)
When('I open the homepage {string}', (url: string) => {
  cy.visit(url);
});

// İsterseniz parametresiz sürüm (base URL'den)
When('I open the homepage', () => {
  const url = Cypress.env('WEB_BASE') || 'http://127.0.0.1:3001/';
  cy.visit(url);
});

// Select helpers for new UI
function selectFor(label: string): string {
  const key = label.toLowerCase().trim();
  if (key === 'team') return '[data-cy="shiftTeamSelect"]';
  if (key === 'user') return '[data-cy="assignmentUserSelect"], [data-cy="leaveUserSelect"]';
  if (key === 'shift') return '[data-cy="assignmentShiftSelect"]';
  if (key === 'status') return '[data-cy="leaveStatusSelect"]';
  throw new Error(`Unknown select label: ${label}`);
}

When('I choose {string} in the {string} select', (option: string, label: string) => {
  cy.get(selectFor(label)).first().should('exist').select(option);
});

export {};
