import { createStore } from 'vuex';

import modules from './modules';

export default createStore({
  modules,
  state: {
    currentAssistantId: '',
    itemsPerPage: 30,
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
    setCurrentAssistantId(state, id) {
      state.currentAssistantId = id;
    },
  },
  actions: {
    setCurrentAssistantId({ commit }, id) {
      commit('setCurrentAssistantId', id);
    },
    showOverlay({ commit }, active) {
      commit('showOverlay', active);
    },
  },
});
