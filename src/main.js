import Vue from 'vue';
import Vuetify from 'vuetify';
import Web3Check, { ACTIONS } from 'vue-web3-check';
import App from './App.vue';
import router from './router';
import store from './store';
import * as config from './config';
import * as filters from './utils/filters';
import IconLink from './components/IconLink';
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

Vue.use(Vuetify);

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

Vue.filter('fromWei', filters.fromWei);
Vue.component('IconLink', IconLink);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
