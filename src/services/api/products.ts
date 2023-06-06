import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  list(
    query: GenericObject = { sort: 'created_at', order: '-1' },
  ): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/products', {
      params: query,
    });
  },
  listOne(assistant_id: string): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/products/' + assistant_id);
  },
  update(id: string, payload: { [key: string]: any }): Promise<any> {
    return axios.put(config.BACKEND_BASE_URL + `/api/products/${id}`, payload);
  },
  create(payload: { [key: string]: any }): Promise<any> {
    return axios.post(config.BACKEND_BASE_URL + '/api/products', payload);
  },
  delete(id: string) {
    return axios.delete(config.BACKEND_BASE_URL + `/api/products/${id}`);
  },
  getNodesHandler(assistant_id: string): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL + `/api/products/${assistant_id}/nodes_handler`,
    );
  },
  train(assistant_id: string): Promise<any> {
    return axios.post(
      config.BACKEND_BASE_URL + `/api/products/${assistant_id}/train_llm`,
    );
  },
  search(
    assistant_id: string,
    query: string,
    session_id: string,
  ): Promise<any> {
    return axios.post(config.BACKEND_BASE_URL + `/api/products/search`, {
      assistant_id,
      query,
      session_id,
    });
  },
};
