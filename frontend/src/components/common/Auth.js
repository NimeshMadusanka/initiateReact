import React, { Fragment } from 'react';
import axios from '../../utils/lib/axios';

export default function Auth({ children }) {
  axios.interceptors.request.use(
    function (config) {
      config.headers['Authorization'] =
        'Bearer ' + sessionStorage.getItem('accessToken');
      return config;
    },
    null,
    { synchronous: true }
  );

  return <Fragment>{children}</Fragment>;
}
