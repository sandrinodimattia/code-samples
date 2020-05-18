// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-param-reassign */

module.exports = {
  env: {
    AUTH0_DOMAIN: 'you.auth0.com',
    AUTH0_CLIENT_ID: 'your_client_id',
    AUTH0_AUDIENCE: 'your_api_identifier',
    AUTH0_SCOPE: 'openid profile roles',
    MONGO_APPLICATION_ID: 'your-application-id',
    MONGO_DATABASE: 'your-db-name',
    MONGO_SERVICE_NAME: 'my-app',
    MONGO_CHARTS_BASE_URL: 'https://charts.mongodb.com/charts-your-account',
    MONGO_CHART_ID: 'your-chart-id'
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      };

      // On the client side, use the stitch browser SDK.
      config.resolve.alias = {
        ...config.resolve.alias,
        'mongodb-stitch-server-sdk': 'mongodb-stitch-browser-sdk'
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
