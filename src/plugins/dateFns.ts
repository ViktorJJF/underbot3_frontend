import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
  install: (app: any) => {
    app.config.globalProperties.$formatDate = (
      date: string,
      formatTemplate: string = "d 'de' MMMM 'del' yyyy",
    ) => {
      return format(new Date(date), formatTemplate, {
        locale: es,
      });
    };
    app.provide('$formatDate', app.config.globalProperties.$formatDate);
  },
};
