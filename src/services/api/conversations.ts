import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  list(
    query: GenericObject = { sort: 'createdAt', order: '1' },
    assistant_id: string,
  ): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL + `/api/assistants/${assistant_id}/conversations`,
      {
        params: query,
      },
    );
  },
  listOne(id: string, assistant_id: string): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/conversations/${id}`,
    );
  },
  update(
    id: string,
    payload: { [key: string]: any },
    assistant_id: string,
  ): Promise<any> {
    return axios.put(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/conversations/${id}`,
      payload,
    );
  },
  create(payload: { [key: string]: any }, assistant_id: string): Promise<any> {
    return axios.post(
      config.BACKEND_BASE_URL + `/api/assistants/${assistant_id}/conversations`,
      payload,
    );
  },
  delete(id: string, assistant_id: string) {
    return axios.delete(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/conversations/${id}`,
    );
  },
};