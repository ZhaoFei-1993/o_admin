import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Raven
  .config('https://369678e1c4f442168dcd9ab95fc5bcc8@sentry.coinex.com/3')
  .addPlugin(RavenVue, Vue)
  .install();
