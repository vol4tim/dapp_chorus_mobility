import Vue from 'vue';
import Web3Check, { ACTIONS } from 'vue-web3-check';
import Fragment from 'vue-fragment';
import VueWait from 'vue-wait';
import App from './App.vue';
import router from './router';
import store from './store';
import * as config from './config';
import * as filters from './utils/filters';
import IconLink from './components/IconLink';

Vue.config.productionTip = false;

Web3Check.store.on('update', data => {
  if (
    (data.state.old.account !== null && data.action === ACTIONS.UPD_ACCOUNT) ||
    (data.state.old.networkId !== null &&
      data.action === ACTIONS.UPD_NETWORK_ID)
  ) {
    window.location.reload(false);
  }
});
Vue.use(Web3Check, {
  Web3,
  networks: [config.CHAIN_ID],
  requireAccount: true
});

Vue.use(VueWait);
Vue.use(Fragment.Plugin);
Vue.filter('fromWei', filters.fromWei);
Vue.component('IconLink', IconLink);

new Vue({
  router,
  store,
  wait: new VueWait(),
  render: h => h(App)
}).$mount('#app');
