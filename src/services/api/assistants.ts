import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  list(
    query: GenericObject = { sort: 'created_at', order: '-1' },
  ): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + '/api/assistants', {
      params: query,
    });
  },
  listOne(assistant_id: string): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL + '/api/assistants/' + assistant_id,
    );
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
  getNodesHandler(assistant_id: string): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL + `/api/assistants/${assistant_id}/nodes_handler`,
    );
  },
  train(assistant_id: string, modules_to_train: string[]): Promise<any> {
    return axios.post(
      config.BACKEND_BASE_URL + `/api/assistants/${assistant_id}/train_llm`,
      { modules_to_train },
    );
  },
  generateFromWatson(assistant_id: string): Promise<any> {
    return axios.post(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/generate_from_watson`,
    );
  },
};
