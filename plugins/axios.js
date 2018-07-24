import {loginURL} from "../common/constants";
import Vue from 'vue';
import cookies from "./cookies";

export default function ({app, $axios, store, redirect, isClient, req}) {
  let cookieString = '';
  if (isClient) {
    cookieString = document.cookie
  } else {
    cookieString = req.headers.cookie
  }
  const cookiesObj = cookies.parse(cookieString)
  $axios.setHeader('Authorization', cookiesObj.token)

  $axios.onResponse(response => {
    const $message = Vue.prototype.$message || console.log;
    console.log('response', response);
    // if (response.data && response.data.code === 401) {
    //   $message({message: '请登录之后再尝试', type: 'warning', duration: 8000});
    //   window.location.href = loginURL;
    // }
    // if (response.data && response.data.code === 403) {
    //   // logged in but without admin role
    //   $message({message: '您无权进行当前操作', type: 'warning', duration: 8000});
    //   store.commit('sign', true);
    //   redirect('/forbidden');
    // }
    if (response.data && response.data.code > 0) {
      $message({message: response.data.message + ' 错误代码：' + response.data.code, type: 'error', duration: 8000});
    }
    return response
  });
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 401) {
      window.location.href = loginURL;
    }
    if (code === 403 ) {
      redirect('/forbidden');
    }
    if (code >= 500) {
      redirect('/error');
    }
  })
};
