const Login = require('./auth0');

module.exports = (on, config) => {
  on('task', {
    LoginPuppeteer: Login
  });
};
