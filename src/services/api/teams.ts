import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  list(
    query: GenericObject = { sort: 'created_at', order: '-1' },
  ): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/teams', {
      params: query,
    });
  },
  listOne(id: string): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/teams/' + id);
  },
  update(id: string, payload: GenericObject): Promise<any> {
    return axios.put(config.BACKEND_BASE_URL + `/api/teams/${id}`, payload);
  },
  create(payload: GenericObject): Promise<any> {
    return axios.post(config.BACKEND_BASE_URL + '/api/teams', payload);
  },
  delete(id: string) {
    return axios.delete(config.BACKEND_BASE_URL + `/api/teams/${id}`);
  },
};
