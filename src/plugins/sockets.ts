// @ts-nocheck

import io from 'socket.io-client';
import config from '@/config';

const socketUrl = config.BACKEND_BASE_URL;
const socket = io(socketUrl);
import store from '@/store/index';
import { useRoute } from 'vue-router';
import { getCurrentPageQueryParams } from '@/utils/utils';

const route = useRoute();

socket.on('CONNECTED', (socketId) => {
  console.log('CONECTADO!: ', socketId);
});

socket.on('NEW_ODD', (data) => {
  // console.log('LLego nuevo odd: ', data);
  const { matchId, bettingOdds } = data;
  // store.commit('matchesModule/setNewOdd', data);
  // search match
  const match = store.state.matchesModule.matches.find(
    (el) => el._id == matchId,
  );
  const queryParams = getCurrentPageQueryParams();
  if (match) {
    // search odds to add (for now 'Totales (incl. prórroga)')
    // add createdAt field to all odds
    for (const odd of bettingOdds) {
      odd.createdAt = new Date();
    }
    const odds = bettingOdds.find((odd) => odd.name === queryParams?.bet_name);
    if (odds) {
      console.log('🐞 LOG HERE bettingOdds:', bettingOdds);
      console.log('pusheando odd: ', odds);
      match.odds.push(odds);
      console.log('Nuevo match odds: ', match.odds);
    }
  }
});

socket.on('MATCH_DETAIL', (data) => {
  const {
    matchId,
    league,
    millis,
    homeScore,
    awayScore,
    quarter,
    periods,
    events,
    isMatchOver,
  } = data;
  // search match
  const match = store.state.matchesModule.matches.find(
    (el) => el._id == matchId,
  );
  if (match) {
    match.basketClock = millis;
    match.scoresDetailed.home = homeScore;
    match.scoresDetailed.away = awayScore;
    match.quarter = quarter;
    match.periods = periods;
    match.events = events;
    match.isMatchOver = isMatchOver;
  }
});

export default socket;
