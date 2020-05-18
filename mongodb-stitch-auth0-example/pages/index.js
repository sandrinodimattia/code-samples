/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import {
  Box,
  Heading,
  Text,
  Divider,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels
} from '@chakra-ui/core';

import {
  LoginAuth0,
  LoginMongo,
  MongoStitch,
  MongoChart,
  Header,
  Container
} from '../components';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  onAuthenticated = (isAuthenticated) => {
    this.setState({
      isAuthenticated
    });
  };

  render() {
    return (
      <Box mb={5}>
        <Header />
        <Box as="section" pt={24}>
          <Container>
            <Box mx="auto" px={{ md: 6 }}>
              <Heading as="h1" size="xl" fontWeight="semibold">
                Using Auth0 as a custom JWT authentication provider for MongoDB
                Stitch
              </Heading>

              <Text opacity="0.7" fontSize="xl" mt="6">
                MongoDB Stitch allows you to configure a{' '}
                <Link href="https://docs.mongodb.com/stitch/authentication/custom-token/">
                  custom JWT authentication
                </Link>{' '}
                provider for giving end users access to your MongoDB Stitch
                application. Learn how you can use Auth0 as a provider with this
                example.
              </Text>
            </Box>
          </Container>
        </Box>

        <Divider my={10} />

        <Container>
          <Box mb={5} px={{ md: 6 }}>
            <Tabs>
              <TabList>
                <Tab>Login</Tab>
                <Tab isDisabled={!this.state.isAuthenticated}>
                  MongoDB Stitch
                </Tab>
                <Tab isDisabled={!this.state.isAuthenticated}>
                  MongoDB Charts
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box mt={5}>
                    <LoginAuth0 />
                  </Box>
                  <Box mt={5}>
                    <LoginMongo onAuthenticated={this.onAuthenticated} />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt={5}>
                    <MongoStitch />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt={5}>
                    <MongoChart />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </Box>
    );
  }
}
