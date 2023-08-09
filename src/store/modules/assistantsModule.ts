import api from '@/services/api/assistants';
import {
  buildSuccess,
  handleError,
  buildQueryWithPagination,
} from '@/utils/utils';
import type { GenericObject } from '@/types/GenericObject';

const module = {
  namespaced: true,
  state: {
    assistants: [],
    messages: [],
    selectedChat: null,
    total: 0,
    totalPages: 0,
    hasToUpdateSelectedChat: false,
    hasPendingNegotiationStatus: false,
    filters: {
      negotiationStatusId: null,
      selectedSellTeamObject: null,
    },
    currentController: null,
  },
  actions: {
    list(
      { commit, state }: { commit: any; state: any },
      query: GenericObject = {},
    ) {
      let finalQuery: GenericObject = buildQueryWithPagination(query);
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .list(finalQuery)
          .then((response) => {
            commit('loadingModule/showLoading', false, { root: true });
            commit('list', response.data.payload);
            commit('totalItems', response.data.totalDocs);
            commit('totalPages', response.data.totalPages);
            resolve(response.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    listOne(
      { commit, state }: { commit: any; state: any },
      assistant_id: string,
    ) {
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .listOne(assistant_id)
          .then((response) => {
            commit('loadingModule/showLoading', false, { root: true });
            resolve(response.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    create({ commit }: { commit: any; state: any }, data: GenericObject) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .create(data)
          .then((res) => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro guardado con éxito');
            commit('create', res.data.payload);
            resolve(res.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    update(
      { commit }: { commit: any; state: any },
      { id, data, notifyUser = true }: any = {},
    ) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .update(id, data)
          .then((res) => {
            commit('loadingModule/showLoading', false, { root: true });
            if (notifyUser) {
              buildSuccess('Registro actualizado con éxito');
            }
            commit('update', {
              id,
              data: res.data.payload,
            });
            resolve(res.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    delete({ commit }: { commit: any; state: any }, id: string) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .delete(id)
          .then(() => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro eliminado con éxito');
            commit('delete', id);
            resolve(null);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    train(
      { commit }: { commit: any; state: any },
      { assistant_id, modules_to_train }: any,
    ) {
      return new Promise((resolve, reject) => {
        api
          .train(assistant_id, modules_to_train)
          .then(() => {
            buildSuccess('Entrenamiento finalizado con éxito');
            resolve(null);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    generateFromWatson(
      { commit }: { commit: any; state: any },
      assistant_id: string,
    ) {
      return new Promise((resolve, reject) => {
        api
          .generateFromWatson(assistant_id)
          .then(() => {
            buildSuccess('Sincronización con Watson finalizada');
            resolve(null);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
  },
  mutations: {
    list(state: GenericObject, data: GenericObject) {
      state.assistants = data;
    },
    totalItems(state: GenericObject, data: GenericObject) {
      state.total = data;
    },
    totalPages(state: GenericObject, data: GenericObject) {
      state.totalPages = data;
    },
    create(state: GenericObject, data: GenericObject) {
      state.assistants.push(data);
    },
    update(
      state: GenericObject,
      { id, data }: { id: string; data: GenericObject },
    ) {
      let indexToUpdate = state.assistants.findIndex(
        (el: GenericObject) => el._id == id,
      );
      state.assistants.splice(indexToUpdate, 1, {
        ...data,
      });
    },
    delete(state: GenericObject, id: string) {
      let indexToDelete = state.assistants.findIndex(
        (el: GenericObject) => el._id == id,
      );
      state.assistants.splice(indexToDelete, 1);
      state.total -= 1;
    },
  },
  getters: {},
};

export default module;
