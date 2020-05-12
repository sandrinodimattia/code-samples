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
 * Hit the local login endpoint in the application which will redirect to Auth0.
 */
function startLogin() {
  if (!Cypress.env('APPLICATION_LOGIN_URL')) {
    throw new Error('The setting APPLICATION_LOGIN_URL is required but not configured');
  }

  return cy.request({
    url: Cypress.env('APPLICATION_LOGIN_URL'),
    followRedirect: false
  });
}

/**
 * Universal Login
 * @param {*} user
 * @param {*} loginUrl
 */
function followUniversalLogin(user, loginUrl) {
  if (!Cypress.env('APPLICATION_CALLBACK_URL')) {
    throw new Error('The setting APPLICATION_CALLBACK_URL is required but not configured');
  }

  cy.log(`Redirecting to Auth0: ${loginUrl}`);

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
  getUserSessions(email).then(({ user, sessions }) => {
    cy.clearCookies({ domain: Cypress.env('AUTH0_DOMAIN') });

    const existingCookies = sessions.auth0;
    if (existingCookies) {
      cy.log('Loaded Auth0 session from cache');

      existingCookies.forEach((c) => cy.setCookie(c.name, c.value, c.options));
      return;
    }

    cy.log('Auth0 session not found, signing in');

    startLogin().then((response) =>
      followUniversalLogin(user, response.headers.location).then(({ cookies, callbackUrl }) => {
        sessions.auth0 = cookies.map(createCookie);
        sessions.auth0.forEach((c) => cy.setCookie(c.name, c.value, c.options));

        cy.visit(callbackUrl);
        cy.getCookie(Cypress.env('APPLICATION_COOKIE_NAME')).then((cookie) => {
          userSessions[user.email].app = [createCookie(cookie)];
        });
      })
    );
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
      cy.setCookie(c.name, c.value, c.options);
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
