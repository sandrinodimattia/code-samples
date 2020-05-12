require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  auth({
    appSession: {
      cookieSameSite: 'Strict'
    },
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile'
    },
    required: false,
    loginPath: '/login',
    logoutPath: '/logout',
    redirectUriPath: '/callback'
  })
);

app.use('/protected', requiresAuth(), (req, res) => res.send(`Hello user: ${req.openid.user.name}`));
app.use('/', (req, res) => res.send('Home'));

const port = process.env.PORT || 8080;
app.listen(port, function (err) {
  if (err) {
    throw err;
  }

  console.log(`Ready on http://localhost:${port}`);
});
