import axios, { AxiosPromise } from 'axios';

import type { GenericObject } from '@/types/GenericObject';
import config from '@/config';

export default {
  login(email: string, password: string): AxiosPromise {
    const payload: GenericObject = { email, password };
    return axios.post(
      config.DATABOT_DASHBOARD_BACKEND_URL + '/auth/sign_in',
      payload,
    );
  },
};
