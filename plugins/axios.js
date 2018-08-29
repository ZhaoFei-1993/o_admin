import {loginURL} from '../common/constants';
import Vue from 'vue';
import cookies from './cookies';
import {reportError} from './sentry';

export default function ({app, $axios, store, redirect, req}) {
  let cookieString = '';
  if (process.client) {
    cookieString = document.cookie;
  } else {
    cookieString = req.headers.cookie;
  }
  const cookiesObj = cookies.parse(cookieString);
  $axios.setHeader('Authorization', cookiesObj.token);

  $axios.onResponse(response => {
    const data = response.data;
    const $message = Vue.prototype.$message || console.log;
    if (data && data.code === 401) {
      $message({message: '请登录之后再尝试', type: 'warning', duration: 8000});
      window.location.href = loginURL;
    }
    if (data && data.code === 403) {
      // logged in but without admin role
      $message({message: '您无权进行当前操作', type: 'warning', duration: 8000});
      store.commit('sign', true);
      return redirect('/forbidden');
    }
    if (data && data.code) {
      const err = new Error(data.message);
      err.code = data.code;
      err.data = data.data;
      err.message = data.message;

      return Promise.reject(err);
    }

    return response;
  });
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 401) {
      window.location.href = loginURL;
      return;
    }
    if (code === 403) {
      return redirect('/forbidden');
    }
    reportError(error);
    // return redirect('/error');
  });
  $axios.interceptors.request.use(
    function (config) {
      if (!/get|options/i.test(config.method)) {
        const token = Math.random().toString(36).substring(2, 15);

        config.headers.common['X-CSRF-TOKEN'] = token;
        if (/\?/.test(config.url)) {
          config.url += '&X-CSRF-TOKEN=' + token;
        } else {
          config.url += '?X-CSRF-TOKEN=' + token;
        }
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
};
