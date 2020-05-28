// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-param-reassign */

module.exports = {
  env: {
    // None of the values below are secrets, they'll be used by the Single Page Application
    AUTH0_DOMAIN: 'auth.sandrino.dev',
    AUTH0_CLIENT_ID: 'z9p3mE4Oc1PN4XKooapkPpn22nRONdJC',
    AUTH0_AUDIENCE: 'urn:colors-api',
    AUTH0_SCOPE: 'openid profile roles read:colors',
    API_GATEWAY_BASE_URL:
      'https://mosfswagr3.execute-api.us-east-1.amazonaws.com'
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      };
    }

    // Don't load auth0.js on the server.
    if (isServer) {
      config.module.rules.push({
        test: /\/lib\/auth0.js/u,
        use: 'null-loader'
      });
    }

    return config;
  }
};
