import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import data from './modules/data';
import token from './modules/token';
// import providers from './modules/providers';

Vue.use(Vuex);

const debug = false;

export default new Vuex.Store({
  modules: {
    data,
    token
    // messages
    // providers
  },
  strict: true, // debug,
  plugins: debug ? [createLogger()] : []
});
