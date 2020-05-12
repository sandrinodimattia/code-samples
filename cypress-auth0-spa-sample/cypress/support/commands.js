const { getUnixTime } = require('date-fns');

const userSessions = {};

/*
 * Create the cookie expiration.
 */
function getFutureTime(minutesInFuture) {
  const time = new Date(new Date().getTime() + minutesInFuture * 60000);
  return getUnixTime(time);
}

/**
 * Get the user's cached sessions.
 * @param {*} email
 */
function getUserSessions(email) {
  return cy.fixture('users.json').then((users) => {
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error('No user found with email: ' + email);
    }

    if (!userSessions[user.email]) {
      userSessions[user.email] = {};
    }

    return {
      user,
      sessions: userSessions[user.email]
    };
  });
}

/**
 * Universal Login
 * @param {*} user
 * @param {*} loginUrl
 */
function followUniversalLogin(user, loginUrl) {
  return cy.task('LoginPuppeteer', {
    username: user.email,
    password: user.password,
    loginUrl,
    callbackUrl: Cypress.env('APPLICATION_CALLBACK_URL')
  });
}

/**
 * Create a cookie object.
 * @param {*} cookie
 */
function createCookie(cookie) {
  return {
    name: cookie.name,
    value: cookie.value,
    options: {
      domain: `${cookie.domain.trimLeft('.')}`,
      expiry: getFutureTime(15),
      httpOnly: cookie.httpOnly,
      path: cookie.path,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
      session: cookie.session
    }
  };
}

/**
 * Login with Auth0.
 */
Cypress.Commands.add('loginAuth0', (email, opt) => {
  return getUserSessions(email).then(({ user, sessions }) => {
    const existingCookies = sessions.auth0;
    if (existingCookies) {
      cy.log('Loaded Auth0 session from cache');

      cy.clearCookies({ domain: Cypress.env('AUTH0_DOMAIN') });
      existingCookies.forEach((c) => cy.setCookie(c.name, c.value, c.options));
      return;
    }

    cy.log('Auth0 session not found, signing in');

    cy.window().should('have.property', 'auth0');
    cy.window().then((win) => {
      win.auth0.buildAuthorizeUrl();
    });

    return cy
      .window()
      .then((win) => win.auth0.buildAuthorizeUrl({}))
      .then((authorizeUrl) => {
        return followUniversalLogin(user, authorizeUrl);
      })
      .then(({ cookies }) => {
        cy.clearCookies({ domain: Cypress.env('AUTH0_DOMAIN') });
        sessions.auth0 = cookies.map(createCookie);
        sessions.auth0.forEach((c) => cy.setCookie(c.name, c.value, c.options));
      });
  });
});

/**
 * Persist the user's tokens in local storage.
 */
Cypress.Commands.add('saveLoginState', (email) => {
  return getUserSessions(email).then(({ user, sessions }) => {
    cy.log(`Saving login state for ${user.email}`);

    if (!sessions.app) {
      sessions.app = [];
    }

    Object.keys(localStorage).forEach((key) => {
      cy.log(`Persisting ${key}`);
      sessions.app.push({
        name: key,
        value: localStorage[key]
      });
    });
  });
});

/**
 * Load the user's tokens in local storage.
 */
Cypress.Commands.add('loadLoginState', (email) => {
  return getUserSessions(email).then(({ user, sessions }) => {
    cy.log(`Loading login state for ${user.email}`);

    if (!sessions.app) {
      throw new Error('Unable to find login state');
    }

    sessions.app.forEach((c) => {
      cy.log(`Loading ${c.name}`);
      localStorage.setItem(c.name, c.value);
    });
  });
});

/**
 * Is there any login state available?
 */
Cypress.Commands.add('hasLoginState', (email) => {
  return getUserSessions(email).then(({ sessions }) => {
    return !!sessions.app;
  });
});

/**
 * Clear any storage (cookies, sessions).
 */
Cypress.Commands.add('clearStorage', (email) => {
  cy.clearLocalStorage();
  cy.clearCookies({ domain: null });
});

/**
 * Validate a silent authentication request.
 */
Cypress.Commands.add('validateSilentAuthentication', (validateFn) => {
  return cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      const listener = (e) => {
        if (e.data.type === 'authorization_response') {
          win.removeEventListener('message', listener);
          const { response } = e.data;
          validateFn(response);
          resolve();
        }
      };
      win.addEventListener('message', listener);
    });
  });
});
