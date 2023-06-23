import { createToast } from 'mosha-vue-toastify';
import api from '@/services/api/auth';
import { buildSuccess, handleError } from '@/utils/utils.js';
import router from '@/router';
import type { GenericObject } from '@/types/GenericObject';

const module = {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isTokenSet: !!localStorage.getItem('token'),
  },
  getters: {
    user: (state: GenericObject) =>
      state.user ? state.user.first_name + ' ' + state.user.last_name : ' ',
    token: (state: GenericObject) => (state.user ? state.user.token : ' '),
    isTokenSet: (state: GenericObject) => state.isTokenSet,
  },
  actions: {
    login(
      { commit }: { commit: any },
      { email, password }: { email: string; password: string },
    ) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .login(email, password)
          .then((response) => {
            if (response.status === 200) {
              const user = response.data.data;
              const token = response.headers['access-token'];
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('token', token);
              commit('saveUser', user);
              commit('saveToken', token);
              buildSuccess('Bienvenido');
              resolve(true);
            }
          })
          .catch((error: any) => {
            createToast('Error al logearse', { timeout: 3000, type: 'danger' });
          })
          .finally(() => {
            commit('loadingModule/showLoading', false, { root: true });
          });
      });
    },
    logout({ commit }: { commit: any }) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('tokenExpiration');
      window.localStorage.removeItem('user');
      router.push({ name: 'login' });
      commit('logout');
    },
    autoLogin({ commit }: { commit: any }) {
      const user: GenericObject = JSON.parse(
        localStorage.getItem('user') as string,
      );
      commit('saveUser', user);
      commit('saveToken', localStorage.getItem('token'));
      // commit(types.EMAIL_VERIFIED, user.verified);
    },
  },
  mutations: {
    saveToken(state: GenericObject, token: string) {
      state.token = token;
      state.isTokenSet = true;
    },
    logout(state: GenericObject) {
      state.user = null;
      state.token = null;
      state.isTokenSet = false;
    },
    saveUser(state: GenericObject, user: string) {
      state.user = user;
    },
  },
};

export default module;
