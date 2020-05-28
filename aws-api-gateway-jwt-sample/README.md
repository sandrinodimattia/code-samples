# AWS API Gateway HTTP API and Auth0

This sample shows how to deploy an AWS API Gateway HTTP API and use a JWT Authorizer to protect your API with Auth0

## API

The `api` folder is a Serverless Framework project which will deploy an API Gateway with JWT Authorizer and a few routes.

To deploy:

```bash
serverless deploy
```

To remove your deployment:

```bash
serverless remove
```

In the `serverless.yml` file you'll need to change the JWT authorizer settings, eg:

```yaml
accessTokenAuth0:
  identitySource: $request.header.Authorization
  issuerUrl: https://auth.sandrino.dev/
  audience:
    - urn:colors-api
```

## Web App

The `web-app` folder is a simple Next.js application which will interact with the API gateway from the browser.

Things you'll need to change:

- [./next.config.js](./next.config.js) enter your Auth0 information and the base URL of your API Gateway.

Running:

```bash
npm run dev
```
