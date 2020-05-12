describe('Anonymous user', () => {
  beforeEach(() => {
    cy.clearStorage();
  });

  afterEach(() => {
    cy.clearStorage();
  });

  it('Get a token', () => {
    cy.visit('index.html');
    cy.get('#getToken').click();

    cy.validateSilentAuthentication((response) => {
      expect(response.error, 'Login should be required').to.equal('login_required');
    });

    cy.contains('div', 'Error:', {
      timeout: 5000
    });
  });

  it('Call an API', () => {
    cy.server();

    cy.visit('index.html');
    cy.get('#callApi').click();

    cy.validateSilentAuthentication((response) => {
      expect(response.error, 'Login should be required').to.equal('login_required');
    });

    cy.contains('div', 'Error:', {
      timeout: 5000
    });
  });
});
