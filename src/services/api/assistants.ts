import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  list(query: GenericObject = { sort: 'createdAt', order: '1' }): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/assistants', {
      params: query,
    });
  },
  listOne(id: string): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/assistants/' + id);
  },
  update(id: string, payload: { [key: string]: any }): Promise<any> {
    return axios.put(
      config.BACKEND_BASE_URL + `/api/assistants/${id}`,
      payload,
    );
  },
  create(payload: { [key: string]: any }): Promise<any> {
    return axios.post(config.BACKEND_BASE_URL + '/api/assistants', payload);
  },
  delete(id: string) {
    return axios.delete(config.BACKEND_BASE_URL + `/api/assistants/${id}`);
  },
};
