import { useFetch } from 'react-async';
import { useState, useEffect } from 'react';

import auth0 from '../lib/auth0';

export default function useApi(baseUrl) {
  const [loading, setLoading] = useState();
  const [httpError, setHttpError] = useState();
  const { data, error, setError, isPending, run } = useFetch(
    baseUrl,
    { headers: { Accept: 'application/json' } },
    { defer: true }
  );

  const isLoading = loading || isPending;

  useEffect(() => {
    async function parseError() {
      if (error) {
        const e = new Error(error.message);
        e.code = error.error;
        e.message = error.message || error.error_description;

        if (error.response) {
          e.status = error.response.status;
          e.body = await error.response.text();
        }

        try {
          e.body = JSON.parse(e.body);
        } catch (err) {
        } finally {
          setHttpError(e);
        }
      } else {
        setHttpError(null);
      }
    }
    parseError();
  }, [error]);

  return {
    data: isLoading || error ? null : data,
    error: httpError || error,
    isPending: (error && false) || isLoading,
    get: async (endpoint, options = { auth: true }) => {
      setLoading(true);
      setHttpError(null);

      try {
        let token = null;
        if (options.auth) {
          token = await auth0.getTokenSilently();
        }
        // Execute the request.
        run((init) => {
          const headers = init.headers;
          return {
            ...init,
            resource: `${init.resource}${endpoint}`,
            headers:
              (token && {
                ...headers,
                Authorization: 'Bearer ' + token
              }) ||
              headers
          };
        });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
  };
}
