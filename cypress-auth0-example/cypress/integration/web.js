describe('My web application', () => {
  beforeEach(() => {
    const user = Cypress.env('DEFAULT_USER');
    cy.loginAuth0(user);
    cy.loadLoginState(user);
  });

  it('Visit the homepage without authentication', () => {
    cy.visit('http://localhost:8080');
  });

  it('Sign in and access a protected resource', () => {
    const user = Cypress.env('DEFAULT_USER');
    cy.visit('http://localhost:8080/protected');
    cy.contains('body', `Hello user: ${user}`, {
      timeout: 5000
    });
  });
});
