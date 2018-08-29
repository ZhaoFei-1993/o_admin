import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

const isProd = process.env.MODE === 'production';
if (isProd) {
  Raven
    .config('https://369678e1c4f442168dcd9ab95fc5bcc8@sentry.coinex.com/3')
    .addPlugin(RavenVue, Vue)
    .install();
}
export const reportError = (err) => {
  if (isProd) {
    Raven.captureException(err);
  } else {
    console.error(err);
  }
};
