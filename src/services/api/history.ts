import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/src/types/GenericObject';

export default {
  scrapHistory(
    team_slugs: string[] = [],
    date: string,
    matchSlug: string,
    until_year: number,
  ) {
    return axios.post(
      config.DASHBOARD_BASE_URL + '/api/history/scrap_history',
      {
        team_slugs,
        date,
        matchSlug,
        until_year,
      },
    );
  },
};
