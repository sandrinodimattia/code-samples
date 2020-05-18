/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable camelcase */
import React from 'react';
import { Button, Icon } from '@chakra-ui/core';

import { Snippet } from '.';
import auth0 from '../lib/auth0';

export default class Login extends React.Component {
  async componentDidMount() {
    if (window.location.search.includes('code=')) {
      await auth0.handleRedirectCallback();

      history.pushState('', document.title, window.location.pathname);

      const user = await auth0.getUser();
      const accessToken = await auth0.getTokenSilently();

      this.setState({
        user,
        accessToken
      });
    }
  }

  login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.href
    });
  };

  render() {
    return (
      <>
        <Button
          size="md"
          mb={5}
          onClick={this.login}
          leftIcon={(props) => <Icon name="lock" {...props} />}
        >
          Login with Auth0
        </Button>
        <Snippet
          code={
            (this.state &&
              this.state.user &&
              JSON.stringify(this.state, null, 2)) ||
            '// You need to sign in first'
          }
          language="json"
        />
      </>
    );
  }
}
