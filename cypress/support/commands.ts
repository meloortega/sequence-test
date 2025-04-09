// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please test more thoroughly.
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email: string, password: string) => {
  // Add login logic here if needed
});

// -- This is a child command --
Cypress.Commands.add('logout', () => {
  // Add logout logic here if needed
});

// -- This is a dual command --
Cypress.Commands.add('dismiss', { prevSubject: 'optional' }, (subject, options) => {
  return cy.wrap(subject).trigger('keydown', { keyCode: 27 });
});
