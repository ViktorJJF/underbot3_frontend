import { createStore } from 'vuex';

import modules from './modules';

export default createStore({
  modules,
  state: {
    itemsPerPage: 25,
    snackbar: {
      text: '',
      active: false,
      color: 'success',
    },
    toolbar: {
      drawerIcon: null,
    },
    overlay: {
      active: false,
    },
  },
  mutations: {
    showOverlay(state, active) {
      state.overlay.active = active;
    },
  },
  actions: {
    showOverlay({ commit }, active) {
      commit('showOverlay', active);
    },
  },
});
