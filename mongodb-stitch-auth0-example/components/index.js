import React from 'react';
import dynamic from 'next/dynamic';

import Header from './helpers/Header';
import Snippet from './helpers/Snippet';
import Container from './helpers/Container';

import LoginMongo from './LoginMongo';
import MongoStitch from './MongoStitch';

const LoginAuth0 = dynamic(() => import('../components/Login.js'), {
  ssr: false,
  loading: () => <p>...</p>
});

const MongoChart = dynamic(() => import('../components/MongoChart'), {
  ssr: false,
  loading: () => <p>...</p>
});

export {
  LoginAuth0,
  LoginMongo,
  MongoStitch,
  MongoChart,
  Header,
  Container,
  Snippet
};
