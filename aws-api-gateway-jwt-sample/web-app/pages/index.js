/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import {
  Box,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels
} from '@chakra-ui/core';

import { API, LoginAuth0, Header, Container } from '../components';

export default class extends React.Component {
  render() {
    return (
      <Box mb={5}>
        <Header />
        <Divider my={10} />

        <Container>
          <Box mb={5} px={{ md: 6 }}>
            <Tabs>
              <TabList>
                <Tab>Login</Tab>
                <Tab>API</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box mt={5}>
                    <LoginAuth0 />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt={5}>
                    <API />
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
