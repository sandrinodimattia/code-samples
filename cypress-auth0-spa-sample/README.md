# Cypress & Auth0 for JAMstack/Single Page Apps

Things you'll need to change:

- [./cypress/fixtures/users.json](./cypress/fixtures/users.json) with the credentials of your users
- [./cypress.json](./cypress.json) with the urls and settings of your application
- [./index.html](./index.html) with the settings of your application

Running interactively:

```bash
npm run cy:open
```

Terminal based:

```bash
npm run test
```

More information: [https://sandrino.dev/blog/writing-cypress-e2e-tests-with-auth0](https://sandrino.dev/blog/writing-cypress-e2e-tests-with-auth0)
