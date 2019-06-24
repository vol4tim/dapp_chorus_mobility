// initial state
const state = {
  isShowControls: true,
  liability: '',
  result: false
};

// getters
const getters = {};

// actions
const actions = {};

// mutations
const mutations = {
  showControls(state, data) {
    state.isShowControls = data;
  },
  liability(state, data) {
    state.liability = data;
  },
  result(state, data) {
    state.result = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
