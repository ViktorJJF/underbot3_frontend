import api from '@/services/api/llmTracker';
import {
  buildSuccess,
  handleError,
  buildQueryWithPagination,
  getAssistantIdFromUrl,
} from '@/utils/utils';
import type { GenericObject } from '@/types/GenericObject';

const module = {
  namespaced: true,
  state: {
    llmTracker: [],
    total: 0,
    totalPages: 0,
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
          .list(finalQuery, getAssistantIdFromUrl())
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
    listOne({ commit, state }: { commit: any; state: any }, id: string) {
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .listOne(id, getAssistantIdFromUrl())
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
        api
          .create(data, getAssistantIdFromUrl())
          .then((res) => {
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
        api
          .update(id, data, getAssistantIdFromUrl())
          .then((res) => {
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
        api
          .delete(id, getAssistantIdFromUrl())
          .then(() => {
            buildSuccess('Registro eliminado con éxito');
            commit('delete', id);
            resolve(null);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    getTotalTokens(
      { commit }: { commit: any; state: any },
      {
        session_id,
        by,
      }: {
        session_id: string;
        by: 'assistant' | 'session';
      },
    ) {
      return new Promise((resolve, reject) => {
        api
          .getTotalTokens(getAssistantIdFromUrl(), by, session_id)
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
  },
  mutations: {
    list(state: GenericObject, data: GenericObject) {
      state.llmTracker = data;
    },
    totalItems(state: GenericObject, data: GenericObject) {
      state.total = data;
    },
    totalPages(state: GenericObject, data: GenericObject) {
      state.totalPages = data;
    },
    create(state: GenericObject, data: GenericObject) {
      state.llmTracker.push(data);
    },
    update(
      state: GenericObject,
      { id, data }: { id: string; data: GenericObject },
    ) {
      let indexToUpdate = state.llmTracker.findIndex(
        (el: GenericObject) => el._id == id,
      );
      state.llmTracker.splice(indexToUpdate, 1, {
        ...data,
      });
    },
    delete(state: GenericObject, id: string) {
      let indexToDelete = state.llmTracker.findIndex(
        (el: GenericObject) => el._id == id,
      );
      state.llmTracker.splice(indexToDelete, 1);
      state.total -= 1;
    },
  },
  getters: {},
};

export default module;
