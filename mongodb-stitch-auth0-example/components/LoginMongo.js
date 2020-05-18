import React from 'react';
import { Button, Icon } from '@chakra-ui/core';

import auth0 from '../lib/auth0';
import MongoClient from '../lib/mongo';

import { Snippet } from '.';

export default class LoginMongoExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mongoUser: null,
      mongoError: null
    };
  }

  updateAuthenticated = (isAuthenticated) => {
    if (this.props.onAuthenticated) {
      this.props.onAuthenticated(isAuthenticated);
    }
  };

  login = async () => {
    try {
      const accessToken = await auth0.getTokenSilently();
      const mongoUser = await MongoClient.loginWithToken(accessToken);

      MongoClient.connect();

      this.updateAuthenticated(true);
      this.setState({
        mongoUser,
        mongoError: null
      });
    } catch (error) {
      this.updateAuthenticated(false);
      this.setState({
        mongoUser: null,
        mongoError: {
          errorTitle: 'MongoDB Stitch',
          error: error.message
        }
      });
    }
  };

  loginWithRefreshToken = async () => {
    try {
      const mongoUser = await MongoClient.refreshAccessToken();

      MongoClient.connect();

      this.updateAuthenticated(true);
      this.setState({
        mongoUser,
        mongoError: null
      });
    } catch (error) {
      this.updateAuthenticated(false);
      this.setState({
        mongoUser: null,
        mongoError: {
          errorTitle: 'MongoDB Stitch',
          error: error.message
        }
      });
    }
  };

  render() {
    return (
      <>
        <Button
          size="md"
          mb={5}
          mr={5}
          onClick={this.login}
          leftIcon={(props) => <Icon name="external-link" {...props} />}
        >
          Login to MongoDB Stitch
        </Button>
        <Button
          size="md"
          mb={5}
          onClick={this.loginWithRefreshToken}
          leftIcon={(props) => <Icon name="external-link" {...props} />}
        >
          Use Mongo Refresh Token
        </Button>
        <Snippet
          code={
            (this.state &&
              this.state.mongoUser &&
              JSON.stringify(this.state.mongoUser, null, 2)) ||
            (this.state &&
              this.state.mongoError &&
              JSON.stringify(this.state.mongoError, null, 2)) ||
            '// You need to sign in first'
          }
          language="json"
        />
      </>
    );
  }
}
