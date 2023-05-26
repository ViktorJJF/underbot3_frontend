import type { GenericObject } from '@/types/GenericObject';

const module = {
  namespaced: true,
  state: {
    loading: false,
  },
  actions: {
    showLoading({ commit }: GenericObject, value: boolean) {
      commit('showLoading', value);
    },
  },
  mutations: {
    showLoading(state: GenericObject, value = true) {
      state.loading = value;
    },
  },
  getters: {},
};

export default module;
