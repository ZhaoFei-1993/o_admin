import {loginURL} from '../common/constants';
import Vue from 'vue';
import cookies from './cookies';

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
    }
    if (code === 403) {
      return redirect('/forbidden');
    }
    // return redirect('/error');
  });
};
