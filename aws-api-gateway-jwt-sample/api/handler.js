module.exports.colors = async () => {
  return [
    'silver',
    'grey',
    'black',
    'navy',
    'blue',
    'cerulean',
    'sky blue',
    'turquoise',
    'blue-green',
    'teal',
    'cyan',
    'green',
    'lime',
    'chartreuse',
    'olive',
    'yellow',
    'gold',
    'amber'
  ];
};

module.exports.myColors = async (event) => {
  return ['yellow', 'gold', 'amber'];
};

/**
 * Return the user's information. During an authenticated request the claims will reflect the contents of the token, eg:
 *
 * {
 *   "aud": "[urn:colors-api https://sandrino.auth0.com/userinfo]",
 *   "azp": "z9p3mE4Oc1PN4XKooapkPpn22nRONdJC",
 *   "exp": "1590747047",
 *   "http://sandrino/email": "sandrino@auth0.com",
 *   "http://sandrino/email_verified": "true",
 *   "http://sandrino/roles": "[things_app_admin]",
 *   "iat": "1590660647",
 *   "iss": "https://auth.sandrino.dev/",
 *   "sub": "auth0|593b80d5f8a341400599ce4f"
 * }
 */
module.exports.myProfile = async (event) => {
  const claims = event.requestContext.authorizer.jwt.claims;
  return {
    id: claims.sub,
    roles: claims['http://sandrino/roles'],
    claims
  };
};
