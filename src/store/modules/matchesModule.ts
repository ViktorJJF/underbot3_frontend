import api from '@/services/api/matches';
import {
  buildSuccess,
  handleError,
  buildQueryWithPagination,
} from '@/utils/utils';
import type { GenericObject } from '@/types/GenericObject';

const module = {
  namespaced: true,
  state: {
    new_odd: null,
    matches: [],
    total: 0,
    totalPages: 0,
  },
  actions: {
    list(
      { commit, state }: { commit: any; state: any },
      query: GenericObject = {},
    ) {
      const finalQuery: GenericObject = buildQueryWithPagination(query);
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .list(finalQuery)
          .then((response: any) => {
            commit('loadingModule/showLoading', false, { root: true });
            commit('list', response.data.payload);
            // If pagination metadata is not provided, we'll set it to -1
            // to indicate we don't have a reliable total count
            commit('totalItems', response.data.totalDocs !== undefined ? response.data.totalDocs : -1);
            commit('totalPages', response.data.totalPages || 0);
            resolve(response.data.payload);
          })
          .catch((error: any) => {
            handleError(error, commit, reject);
          });
      });
    },
    listOne(
      { commit, state }: { commit: any; state: any },
      { id, query }: { id: string; query: GenericObject },
    ) {
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        console.log('🐞 LOG HERE query:', query);
        api
          .listOne(id, query)
          .then((response: any) => {
            commit('loadingModule/showLoading', false, { root: true });
            resolve(response.data.payload);
          })
          .catch((error: any) => {
            handleError(error, commit, reject);
          });
      });
    },
    create({ commit }: { commit: any; state: any }, data: GenericObject) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .create(data)
          .then((res: any) => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro guardado con éxito');
            commit('create', res.data.payload);
            resolve(res.data.payload);
          })
          .catch((error: any) => {
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
    getTodayMatches({ commit }: any) {
      return new Promise((resolve, reject) => {
        api
          .getTodayMatches()
          .then(
            (response: {
              data: { payload: unknown; totalDocs: any; totalPages: any };
            }) => {
              commit('list', response.data.payload);
              commit('totalItems', response.data.totalDocs);
              commit('totalPages', response.data.totalPages);
              resolve(response.data.payload);
            },
          )
          .catch((error: GenericObject) => {
            handleError(error, commit, reject);
          });
      });
    },
    getBeatLastUnder({ commit }: any, query: any) {
      console.log('🚀 Aqui *** -> query', query);
      return new Promise((resolve, reject) => {
        api
          .getBeatLastUnder(query)
          .then(
            (response: {
              data: { payload: unknown; totalDocs: any; totalPages: any };
            }) => {
              commit('list', response.data.payload);
              commit('totalItems', response.data.totalDocs);
              commit('totalPages', response.data.totalPages);
              resolve(response.data.payload);
            },
          )
          .catch((error: GenericObject) => {
            handleError(error, commit, reject);
          });
      });
    },
    getMatchesGroupedByTeam({ commit }: any, query: any) {
      return new Promise((resolve, reject) => {
        api
          .getMatchesGroupedByTeam(query)
          .then(
            (response: {
              data: { payload: unknown; totalDocs: any; totalPages: any };
            }) => {
              commit('list', response.data.payload);
              commit('totalItems', response.data.totalDocs);
              commit('totalPages', response.data.totalPages);
              resolve(response.data.payload);
            },
          )
          .catch((error: GenericObject) => {
            handleError(error, commit, reject);
          });
      });
    },
    simulator({ commit }: any, query: GenericObject = {}) {
      return new Promise((resolve, reject) => {
        api
          .simulator(query)
          .then(
            (response: {
              data: { payload: unknown; totalDocs: any; totalPages: any };
            }) => {
              resolve(response.data.payload);
            },
          )
          .catch((error: GenericObject) => {
            handleError(error, commit, reject);
          });
      });
    },
  },
  mutations: {
    list(state: GenericObject, data: GenericObject) {
      state.matches = data;
    },
    totalItems(state: GenericObject, data: GenericObject) {
      state.total = data;
    },
    totalPages(state: GenericObject, data: GenericObject) {
      state.totalPages = data;
    },
    create(state: GenericObject, data: GenericObject) {
      state.matches.push(data);
    },
    update(
      state: GenericObject,
      { id, data }: { id: string; data: GenericObject },
    ) {
      const indexToUpdate = state.matches.findIndex(
        (el: GenericObject) => el._id == id,
      );
      state.matches.splice(indexToUpdate, 1, {
        ...data,
      });
    },
    delete(state: GenericObject, id: string) {
      const indexToDelete = state.matches.findIndex(
        (el: GenericObject) => el._id == id,
      );
      state.matches.splice(indexToDelete, 1);
      state.total -= 1;
    },
    setNewOdd(state: GenericObject, data: GenericObject) {
      state.new_odd = data;
    },
    addMatchEvents(state: GenericObject, { matchId, events }: { matchId: string; events: any[] }) {
      const match = state.matches.find((el: GenericObject) => el._id === matchId);
      if (match) {
        // Initialize matchEvents array if not exists
        if (!match.matchEvents) {
          match.matchEvents = [];
        }
        // Append new events (avoiding duplicates by eventId)
        for (const event of events) {
          const exists = match.matchEvents.some((e: any) => e.eventId === event.eventId);
          if (!exists) {
            match.matchEvents.push(event);
          }
        }
        // Sort by seconds (time order)
        match.matchEvents.sort((a: any, b: any) => a.seconds - b.seconds);

        // Update foul counts
        const foulEvents = match.matchEvents.filter((e: any) => e.type === 'foul');
        match.foulStats = {
          home: foulEvents.filter((e: any) => e.team === 'home').length,
          away: foulEvents.filter((e: any) => e.team === 'away').length,
        };
      }
    },
  },
  getters: {},
};

export default module;
