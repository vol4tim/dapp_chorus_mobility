const getBalanceToken = async (token, account) => {
  return Number(await token.call.balanceOf(account));
};

const getApproveToken = async (token, account, to) => {
  return Number(await token.call.allowance(account, to));
};

// initial state
const state = {
  balance: {},
  approve: {}
};

// getters
const getters = {
  balance: state => address => {
    return state.balance[address] || 0;
  },
  approve: state => (address, to) => {
    return (state.approve[address] && state.approve[address][to]) || 0;
  }
};

// actions
const actions = {
  async watch({ state, dispatch }, token) {
    Object.keys(state.balance).forEach(account => {
      dispatch('getBalance', { token, account });
      if (state.approve.hasOwnProperty(account)) {
        Object.keys(state.approve[account]).forEach(to => {
          dispatch('getApprove', { token, account, to });
        });
      }
    });
    token.contract.allEvents((error, result) => {
      if (result) {
        Object.keys(state.balance).forEach(account => {
          dispatch('getBalance', { token, account });
          if (state.approve.hasOwnProperty(account)) {
            Object.keys(state.approve[account]).forEach(to => {
              dispatch('getApprove', { token, account, to });
            });
          }
        });
      }
    });
  },
  async getBalance({ commit }, { token, account }) {
    commit('balance', {
      account,
      balance: await getBalanceToken(token, account)
    });
  },
  async getApprove({ commit }, { token, account, to }) {
    commit('approve', {
      account,
      to,
      approve: await getApproveToken(token, account, to)
    });
  }
};

// mutations
const mutations = {
  watchBalance(state, account) {
    state.balance = {
      ...state.balance,
      [account]: 0
    };
  },
  watchApprove(state, { account, to }) {
    state.approve = {
      ...state.approve,
      [account]: {
        [to]: 0
      }
    };
  },
  balance(state, { account, balance }) {
    state.balance[account] = balance;
  },
  approve(state, { account, to, approve }) {
    state.approve[account][to] = approve;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
