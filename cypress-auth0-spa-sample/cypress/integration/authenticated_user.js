describe('Authenticated user', () => {
  beforeEach(() => {
    const user = Cypress.env('DEFAULT_USER');

    cy.visit('index.html');
    cy.loginAuth0(user);

    cy.hasLoginState(user).then((hasLoginState) => {
      if (!hasLoginState) {
        cy.log(`No application session found for ${user}`);
        cy.get('#getToken').click();
        cy.contains('div', 'Tokens:', {
          timeout: 5000
        });

        cy.saveLoginState(user);
      } else {
        cy.clearLocalStorage();
        cy.loadLoginState(user);
      }
    });
  });

  afterEach(() => {
    cy.clearStorage();
  });

  it('Get a token', () => {
    cy.visit('index.html');
    cy.get('#getToken').click();
  });

  it('Call an API', () => {
    cy.server();
    cy.route('GET', Cypress.env('SHOWS_API')).as('shows');

    cy.visit('index.html');
    cy.get('#callApi').click();

    cy.wait('@shows').then((xhr) => {
      assert.isNotNull(xhr.response.body.shows, 'TV shows were returned by the API');
    });

    cy.contains('div', 'API Response:', {
      timeout: 5000
    });
  });
});
