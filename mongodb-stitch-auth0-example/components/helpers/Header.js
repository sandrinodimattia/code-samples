/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Box, Flex } from '@chakra-ui/core';

import Container from './Container';

const HeaderContainer = (props) => (
  <Box
    pos="fixed"
    as="header"
    top="0"
    zIndex="4"
    left="0"
    right="0"
    borderBottomWidth="1px"
    width="full"
    height="4rem"
    {...props}
  />
);

export default (props) => {
  return (
    <HeaderContainer bg={'white'} {...props}>
      <Container h="100%">
        <Flex
          size="100%"
          px={['0', '0', '6']}
          align="center"
          justify="space-between"
        >
          <Box display="flex" alignItems="center">
            MongoDB Stitch &amp; Auth0
          </Box>
        </Flex>
      </Container>
    </HeaderContainer>
  );
};
