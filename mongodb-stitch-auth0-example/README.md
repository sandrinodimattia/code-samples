# MongoDB Stitch & Auth0

Things you'll need to change:

- [./next.config.js](./next.config.js) enter your Auth0 and MongoDB information here.

Running:

```bash
npm run dev
```

> Note: This sample uses `"mongodb-stitch-server-sdk` because of how Next.js works. The `next.config.js` file then maps this to `mongodb-stitch-browser-sdk` for any browser code.

More information: [https://sandrino.dev/blog/mongodb-stitch-auth0-authentication-provider](https://sandrino.dev/blog/mongodb-stitch-auth0-authentication-provider)
