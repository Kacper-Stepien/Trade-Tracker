/// <reference types="cypress" />

// Custom command for logging in via UI
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="password"]').type(password);
  cy.get('button').contains(/sign in/i).click();
});

// Custom command for API login (faster than UI login)
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  const apiUrl = Cypress.env('apiUrl');

  cy.request({
    method: 'POST',
    url: `${apiUrl}/auth/sign-in`,
    body: { email, password },
  }).then((response) => {
    // Store the token in localStorage or handle cookies
    window.localStorage.setItem('auth-token', response.body.token);
  });
});