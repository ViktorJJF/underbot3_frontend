import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  list(
    query: GenericObject = { sort: 'createdAt', order: '1' },
    assistant_id: string,
  ): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL + `/api/assistants/${assistant_id}/llm_tracker`,
      {
        params: query,
      },
    );
  },
  listOne(id: string, assistant_id: string): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/llm_tracker/${id}`,
    );
  },
  update(
    id: string,
    payload: { [key: string]: any },
    assistant_id: string,
  ): Promise<any> {
    return axios.put(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/llm_tracker/${id}`,
      payload,
    );
  },
  create(payload: { [key: string]: any }, assistant_id: string): Promise<any> {
    return axios.post(
      config.BACKEND_BASE_URL + `/api/assistants/${assistant_id}/llm_tracker`,
      payload,
    );
  },
  delete(id: string, assistant_id: string) {
    return axios.delete(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/llm_tracker/${id}`,
    );
  },
  getTotalTokens(
    assistant_id: string,
    by: 'assistant' | 'session',
    session_id: string,
  ): Promise<any> {
    return axios.get(
      config.BACKEND_BASE_URL +
        `/api/assistants/${assistant_id}/llm_tracker/get_total_tokens?by=${by}&session_id=${session_id}`,
    );
  },
};
