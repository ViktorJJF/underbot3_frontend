import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  list(
    query: GenericObject = { sort: 'created_at', order: '-1' },
  ): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/matches', {
      params: query,
    });
  },
  listOne(id: string): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/matches/' + id);
  },
  update(id: string, payload: GenericObject): Promise<any> {
    return axios.put(config.BACKEND_BASE_URL + `/api/matches/${id}`, payload);
  },
  create(payload: GenericObject): Promise<any> {
    return axios.post(config.BACKEND_BASE_URL + '/api/matches', payload);
  },
  delete(id: string) {
    return axios.delete(config.BACKEND_BASE_URL + `/api/matches/${id}`);
  },
  listCustom(query = { sort: 'createdAt', order: '1' }) {
    return axios.get(config.DASHBOARD_BASE_URL + '/api/matches/custom', {
      params: query,
    });
  },
  getTodayMatches() {
    return axios.get(
      config.DASHBOARD_BASE_URL + `/api/matches/get_today_matches`,
    );
  },
  getBeatLastUnder(query = {}) {
    return axios.get(
      config.DASHBOARD_BASE_URL + `/api/matches/beat_last_under`,
      { params: query },
    );
  },
  getMatchesGroupedByTeam(query = {}) {
    return axios.get(
      config.DASHBOARD_BASE_URL + `/api/matches/matches_grouped_by_team`,
      { params: query },
    );
  },
};
