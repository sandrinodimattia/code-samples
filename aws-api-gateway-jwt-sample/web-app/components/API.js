import React, { useState } from 'react';
import { Stack, Button, Icon, Checkbox } from '@chakra-ui/core';

import { Snippet } from '.';
import useApi from '../lib/use-api';

export default () => {
  const [authEnabled, setAuthEnabled] = useState(true);
  const { data, error, isPending, get } = useApi(
    process.env.API_GATEWAY_BASE_URL
  );

  console.log({
    data,
    error,
    isPending
  });
  const getColors = () => get('/colors', { auth: authEnabled });
  const getMyProfile = () => get('/my/profile', { auth: authEnabled });
  const getMyColors = () => get('/my/colors', { auth: authEnabled });

  return (
    <>
      <Stack mb={5} isInline spacing={4}>
        <Button
          size="md"
          onClick={getColors}
          leftIcon={(props) => <Icon name="external-link" {...props} />}
        >
          List All Colors
        </Button>
        <Button
          size="md"
          onClick={getMyProfile}
          leftIcon={(props) => <Icon name="external-link" {...props} />}
        >
          My Profile
        </Button>
        <Button
          size="md"
          onClick={getMyColors}
          leftIcon={(props) => <Icon name="external-link" {...props} />}
        >
          My Colors
        </Button>
        <Checkbox
          isChecked={authEnabled}
          onChange={(e) => setAuthEnabled(e.target.checked)}
          children="Authentication"
        />
      </Stack>
      <Snippet
        code={
          (isPending && '// Loading...') ||
          (error && JSON.stringify(error, null, 2)) ||
          (data && JSON.stringify(data, null, 2)) ||
          '// Press one of the buttons above to call the API Gateway'
        }
        language="json"
      />
    </>
  );
};
