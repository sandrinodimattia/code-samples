import {
  Box,
  ColorModeProvider,
  CSSReset,
  Text,
  ThemeProvider,
  theme as chakraTheme
} from '@chakra-ui/core';
import React from 'react';

const theme = {
  ...chakraTheme,
  fontSizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '22px',
    '4xl': '26px',
    '5xl': '30px',
    '6xl': '36px'
  }
};

export default ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider value="light">
        <CSSReset />
        <Box>
          <Component {...pageProps} />
        </Box>
        <Box textAlign="center" pt="12" pb="4" fontSize="sm" opacity="0.6">
          <Text mt="5">Released under the MIT License.</Text>
          <Text>Copyright Sandrino &copy; {new Date().getFullYear()} </Text>
        </Box>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
