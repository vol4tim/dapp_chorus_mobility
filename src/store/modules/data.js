// initial state
const state = {
  isShowControls: false
};

// getters
const getters = {};

// actions
const actions = {};

// mutations
const mutations = {
  showControls(state, data) {
    state.isShowControls = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
