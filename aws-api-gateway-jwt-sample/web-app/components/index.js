import React from 'react';
import dynamic from 'next/dynamic';

import API from './API';
import Header from './helpers/Header';
import Snippet from './helpers/Snippet';
import Container from './helpers/Container';

const LoginAuth0 = dynamic(() => import('./Login.js'), {
  ssr: false,
  loading: () => <p>...</p>
});

export { API, LoginAuth0, Header, Container, Snippet };
