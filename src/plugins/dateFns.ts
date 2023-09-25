import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
  install: (app: any) => {
    app.config.globalProperties.$formatDate = (
      date: string,
      formatTemplate: string = "d 'de' MMMM 'del' yyyy",
    ) => {
      const utcDate = new Date(date);

      // Get the user's timezone offset in minutes and adjust the date accordingly
      const offset = utcDate.getTimezoneOffset();
      const localDate = addMinutes(utcDate, -offset);

      return format(localDate, formatTemplate, {
        locale: es,
      });
    };
    app.provide('$formatDate', app.config.globalProperties.$formatDate);
  },
};
