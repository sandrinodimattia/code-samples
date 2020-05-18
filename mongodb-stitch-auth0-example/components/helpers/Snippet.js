/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Box } from '@chakra-ui/core';
import theme from 'prism-react-renderer/themes/nightOwl';
import { LiveProvider, LiveEditor } from 'react-live';

export default ({ code, language = 'json' }) => {
  return (
    <LiveProvider theme={theme} language={language} disabled code={code.trim()}>
      <Box d={{ md: 'flex' }} alignItems="flex-start">
        <LiveEditor
          padding={20}
          style={{
            fontSize: 14,
            fontFamily: 'Menlo,monospace',
            borderRadius: 10,
            flex: 2
          }}
        />
      </Box>
    </LiveProvider>
  );
};
