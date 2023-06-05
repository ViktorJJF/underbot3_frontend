import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { GenericObject } from '@/types/GenericObject';

export default {
  install: (app: any) => {
    app.config.globalProperties.$deepCopy = (obj: GenericObject) => {
      return JSON.parse(JSON.stringify(obj));
    };
    app.provide('$deepCopy', app.config.globalProperties.$deepCopy);
  },
};
