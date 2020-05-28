/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable camelcase */
import React from 'react';
import jwtDecode from 'jwt-decode';
import { Text, Button, Icon } from '@chakra-ui/core';

import { Snippet } from '.';
import auth0 from '../lib/auth0';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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

      if (this.props.onAuthenticated) {
        this.props.onAuthenticated(true);
      }
    }
  }

  getAccessTokenContents(accessToken) {
    try {
      if (accessToken) {
        return jwtDecode(accessToken);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.href
    });
  };

  render() {
    const accessTokenContents = this.getAccessTokenContents(
      this.state.accessToken
    );

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
        <Text mb={5}>Authentication Response:</Text>
        <Snippet
          code={
            (this.state &&
              this.state.user &&
              JSON.stringify(this.state, null, 2)) ||
            '// Not signed in'
          }
          language="json"
        />

        <Text mt="5" mb={5}>
          Access Token:
        </Text>
        <Snippet
          code={
            (accessTokenContents &&
              JSON.stringify(accessTokenContents, null, 2)) ||
            '// Not signed in'
          }
          language="json"
        />
      </>
    );
  }
}
