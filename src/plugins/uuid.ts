import { v4 as uuidv4 } from 'uuid';

export default {
  install: (app: any) => {
    app.config.globalProperties.$uuid = () => {
      return uuidv4();
    };
    app.provide('$uuid', app.config.globalProperties.$uuid);
  },
};
