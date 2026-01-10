import axios from 'axios';
import config from '@/config';
import type { GenericObject } from '@/types/GenericObject';

export default {
  /**
   * Get events for a match, ordered by time
   */
  getByMatch(
    matchId: string,
    query: GenericObject = {},
  ): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + `/api/match_events/by_match/${matchId}`, {
      params: query,
    });
  },

  /**
   * Get foul statistics for a match
   */
  getFoulStats(matchId: string): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + `/api/match_events/foul_stats/${matchId}`);
  },

  /**
   * Get overall event statistics for a match
   */
  getEventStats(matchId: string): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + `/api/match_events/stats/${matchId}`);
  },

  /**
   * Get latest events (for polling fallback)
   */
  getLatestEvents(
    matchId: string,
    since?: number,
    limit: number = 20,
  ): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + `/api/match_events/latest/${matchId}`, {
      params: { since, limit },
    });
  },

  /**
   * Get score events with running totals
   */
  getScoreEvents(matchId: string): Promise<any> {
    return axios.get(config.BACKEND_BASE_URL + `/api/match_events/scores/${matchId}`);
  },
};
