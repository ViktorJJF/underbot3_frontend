import axios, { AxiosPromise } from 'axios';

import type { GenericObject } from '@/types/GenericObject';
import config from '@/config';

export default {
  login(email: string, password: string): AxiosPromise {
    const payload: GenericObject = { email, password };
    return axios.post('https://api.databot.cl/auth/sign_in', payload);
  },
};
