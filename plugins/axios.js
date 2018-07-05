import {loginURL} from "../common/constants";
import Vue from 'vue';

export default function ({app, $axios, store, redirect}) {
  $axios.onResponse(response => {
    const $message = Vue.prototype.$message || console.log;
    console.log('response', response);
    // 转换本地的jsonserver数据，适配后端的数据结构,axios本身有一层data包裹，后端如果是list将会有另外data包裹
    if (response.data.message === undefined) {
      const transformedData = {
        "code": (response.status >= 200 && response.status < 300) ? 0 : response.status,
        "message": "OK",
        "data": response.data.length ? {
          total: response.headers['x-total-count'] || 1000,
          data: response.data,
        } : response.data,
      };
      response.data = transformedData;
      return response;
    }
    if (response.data && response.data.code === 401) {
      $message({message: '请登录之后再尝试', type: 'warning', duration: 8000});
      window.location.href = loginURL;
    }
    if (response.data && response.data.code === 403) {
      // logged in but without admin role
      $message({message: '您无权进行当前操作', type: 'warning', duration: 8000});
      store.commit('sign', true);
      redirect('/forbidden');
    }
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
    if (code === 403 || code >= 500) {
      redirect('/forbidden');
    }
  })
};
