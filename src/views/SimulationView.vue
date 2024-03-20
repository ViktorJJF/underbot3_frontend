<template>
  <div>
    <div class="container">
      <div class="row my-3">
        <div class="col-sm-3">
          <el-select
            v-model="selectedTeam"
            placeholder="Filtrar equipo"
            @change="initialize"
            clearable
          >
            <el-option
              v-for="(team, idxTeam) in $store.state['teamsModule'].teams"
              :key="idxTeam"
              :label="team.name"
              :value="team._id"
            />
          </el-select>
        </div>
        <div class="col-sm-3">
          <span class="">Desde</span>
          <el-date-picker
            @change="initialize"
            class="mx-2"
            v-model="dateFrom"
            type="date"
            placeholder="Desde"
            size="large"
          />
        </div>
        <div class="col-sm-3">
          <span class="">Hasta</span>
          <el-date-picker
            @change="initialize"
            class="mx-2"
            v-model="dateTo"
            type="date"
            placeholder="Hasta"
            size="large"
          />
        </div>
        <div class="col-sm-3">
          <span class="">Ambos</span>
          <el-date-picker
            @change="initialize"
            class="mx-2"
            v-model="dateBoth"
            type="date"
            placeholder="Ambos"
            size="large"
          />
        </div>
      </div>
      <el-divider></el-divider>
      <div class="row">
        <div v-for="(variable, idx) in variables" :key="idx" class="col-sm-6">
          <el-checkbox
            :label="variable[2]"
            v-model="variable[0]"
            size="large"
          />
          <div>
            <el-switch
              v-if="typeof variable[1] === 'boolean'"
              class="d-block mb-2"
              v-model="variable[1]"
              active-text="Sí"
              :disabled="!variable[0]"
              inactive-text="No"
            />
          </div>
          <el-input
            :type="variable[3]"
            v-if="variable[3] == 'number'"
            :disabled="!variable[0]"
            v-model="variable[1]"
          />
          <el-select v-if="variable[3] == 'text'" v-model="variable[1]">
            <el-option
              v-for="item in ['c1', 'c2', 'c3', 'c4']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <div>
        <h6></h6>
      </div>
      <el-divider />
      <div class="row">
        <div class="col-sm-6">
          <h4>Resultados simulación</h4>
          <h5 class="match-ended" v-show="isCalculating">(Calculando)</h5>
          <h6 class="d-inline">
            Cantidad de apuestas: {{ filteredBets.length }}
          </h6>
          <div>
            <h6 class="d-inline">Winrate:</h6>
            {{ ((winrate || 0) * 100).toFixed(2) }}% ({{ unders.wins }}/{{
              filteredBets.length
            }})
          </div>
          <div>
            <h6 class="d-inline">Dinero Apostado:</h6>
            $ {{ initialMoney }}
          </div>
          <div>
            <h6 class="d-inline">Dinero Obtenido:</h6>
            $ {{ finalMoney }}
          </div>
          <div>
            <h6 class="d-inline">Ganancia neta:</h6>
            $ {{ (finalMoney - initialMoney).toFixed(2) }}
          </div>
          <div>
            <h6 class="d-inline">Beneficio:</h6>
            {{ (profit * 100).toFixed(2) }}%
          </div>
        </div>
        <div class="col-sm-6">
          <div class="col-sm-4">
            <el-button small type="primary" plain @click="simulateByTeams"
              >Simular por equipo</el-button
            >
          </div>
        </div>
      </div>

      <el-divider />

      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Fecha</th>
            <th scope="col">Match</th>
            <th scope="col">Total</th>
            <th scope="col">Bet</th>
            <th scope="col">Apostado</th>
            <th scope="col">Under Quota</th>
            <th scope="col">Beneficio</th>
            <th scope="col">Over Quota</th>
            <th scope="col">Cuarto</th>
            <th scope="col">Score</th>
            <th scope="col">Cantidad de montañas</th>
            <th scope="col">Diferencia ups/downs %</th>
            <th scope="col">¿Primera apuesta?</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="bet.match.hasOvertime ? 'table-danger' : ''"
            v-for="(bet, idx) in filteredBets"
            :key="idx"
          >
            <th scope="row">{{ idx + 1 }}</th>
            <td>{{ formatDate(bet.match.createdAt) }}</td>
            <td>
              <a :href="`/matches/${bet.match._id}`" target="_blank">
                {{
                  `${bet.match.teams[0].name} (${bet.match.scoresDetailed.home}) - (${bet.match.scoresDetailed.away}) ${bet.match.teams[1].name}`
                }}</a
              >
            </td>
            <td>
              {{
                bet.match.scoresDetailed.home + bet.match.scoresDetailed.away
              }}
            </td>
            <td>
              {{ bet.type }} {{ bet.value }} - {{ bet.quarter }}
              {{ isBetWinner(bet) ? '✅' : '❌' }}
            </td>
            <td>S/. {{ bet.money }}</td>
            <td>{{ bet.underQuota }}</td>
            <td>
              {{
                isBetWinner(bet)
                  ? `- S/. ${(bet.money * (bet.underQuota - 1)).toFixed(2)}`
                  : `- ${bet.money}`
              }}
            </td>
            <td>{{ bet.overQuota }}</td>
            <td>
              {{ bet.quarter }} {{ millisToMinutesAndSeconds(bet.millis) }}
            </td>
            <td>
              {{
                bet.scoresDetailed
                  ? `${bet.scoresDetailed.home} - ${bet.scoresDetailed.away}`
                  : 'Sin scores'
              }}
            </td>
            <td>{{ bet.invertedConesLength }}</td>
            <!-- <td>{{ bet.upsDownsDifference.toFixed(2) }}</td> -->
            <td>{{ bet.isFirstBet ? 'Sí' : 'No' }}</td>
            <td>{{ bet.match.externalId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { startOfDay, getTime, subDays } from 'date-fns';
import {
  getHistoryScore24,
  getUpsDowns,
  getInvertedCones,
  millisToMinutesAndSeconds,
  roundDecimal,
  formatDate,
  formatBettingOdds,
} from '@/utils/utils';
import type { GenericObject } from '../types/GenericObject';

const matches = ref<GenericObject[]>([]);
const dateFrom = ref<Date>(new Date(subDays(new Date(), 1)));
const dateTo = ref<Date>(new Date(subDays(new Date(), 1)));
// new date 26 november 2023

const dateBoth = ref<Date>(new Date('2023-10-26'));
const selectedTeam = ref<GenericObject | null>(null);
const isCalculating = ref<boolean>(false);
const initialMoney = ref<number>(0);
const finalMoney = ref<number>(0);
const profit = ref<number>(0);
const delayTimer = ref<any>(0);
const bets = ref<GenericObject[]>([]);
const history = ref<GenericObject>({});
const unders = ref({ wins: 0, losses: 0, winrate: 0 });
const overs = ref({ wins: 0, losses: 0, winrate: 0 });
const winrate = ref<number>(0);
const variables = ref<GenericObject>({
  fromQuarter: [true, 'c4', 'Evaluar desde', 'text'],
  untilQuarter: [true, 'c4', 'Evaluar hasta', 'text'],
  fromTime: [
    true,
    12 * 60 * 1000,
    'Desde (milisegundos) (Faltando 2 min para acabar c3) ',
    'number',
  ],
  untilTime: [
    true,
    5 * 60 * 1000,
    'Hasta (milisegundos) (Antes de llegar al minuto 5 de c4)',
    'number',
  ],
  minUnderPercent: [false, 80, 'Mínimo porcentaje de Under', 'number'],
  hasUnderBeatOver: [false, false, 'Under supera o iguala over', 'boolean'],
  minimalScoreDifference: [
    false,
    8,
    'Mínima diferencia de score (pendiente) (NEW)',
    'number',
  ],
  minimalUpsDownsDifference: [
    true,
    0.1,
    'Mínima diferencia de Ups/Downs %',
    'number',
  ],
  hasInvertedCones: [
    true,
    true,
    'Evaluar gráfica en forma de montañas',
    'boolean',
  ],
  minimalDifferenceToNextBet: [
    true,
    2,
    'Mínima diferencia para apostar de nuevo en mismo match',
    'number',
  ],
  moneyBet: [true, 333, 'Dinero a apostar (Primera apuesta cebo)', 'number'],
  moneyNextBet: [true, 533, 'Dinero a apostar (Siguientes apuestas)', 'number'],
  ignoreFirstBet: [false, true, 'Ignorar primera apuesta', 'boolean'],
});

const $store = useStore();

// const filteredMatches = computed(() => {
//   return selectedLeagues.value.length > 0
//     ? matches.value.filter((el) => selectedLeagues.value.includes(el.league))
//     : matches.value;
// });

const sortedBets = computed(() => {
  return bets.value; // Assuming bets is defined in the setup
});

const filteredBets = computed(() => {
  return variables.value.ignoreFirstBet[0] && variables.value.ignoreFirstBet[1]
    ? bets.value.filter((el) => !el.isFirstBet)
    : sortedBets.value;
});

watch(
  variables,
  () => {
    clearTimeout(delayTimer.value);
    delayTimer.value = setTimeout(() => {
      reEvaluateAll();
    }, 500);
  },
  { deep: true },
);

onMounted(async () => {
  await initialize();
});

async function initialize() {
  const payload: GenericObject = {
    sort: 'createdAt',
    order: 'desc',
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    dateBoth: dateBoth.value,
  };
  if (selectedTeam.value) {
    payload['teamId'] = selectedTeam.value;
  }

  await Promise.all([
    $store.dispatch('matchesModule/list', payload),
    $store.dispatch('teamsModule/list', {
      sort: 'name',
      order: 'asc',
      league: 'NBA',
    }),
  ]);

  matches.value = $store.state.matchesModule.matches;
  // generate unders field
  matches.value = matches.value.map((el) => ({
    ...el,
    unders: formatBettingOdds(el.odds),
  }));
  //   matches.value = matches.value.map((el) => ({
  //   ...el,
  //   scoresDetailed: {home:el.scores[0],away:el.scores[1]},
  // }));
  console.log('🐞 LOG HERE matches.value:', matches.value.length);
  reEvaluateAll();
}

async function reEvaluateAll() {
  isCalculating.value = true;
  resetValues();
  await reEvaluate();
  calculateBenefit();
  isCalculating.value = false;
}

async function reEvaluate() {
  for (const match of matches.value) {
    await simulate(match);
  }
  calculateWinrate(filteredBets.value);
}

function getMatchesSlope() {
  for (const match of matches.value) {
    let matchUnders = match.unders;
    console.log(
      'TEAMS: ',
      match.teams.map((el: { name: any }) => el.name),
    );
    const [minUnder, maxUnder] = getMinMaxPoints(matchUnders);
    const m = getSlope(
      minUnder.value,
      new Date(minUnder.date).getTime(),
      maxUnder.value,
      new Date(maxUnder.date).getTime(),
    );
    console.log('🚀 Aqui *** -> m', m);
    const angle = (Math.atan(m) * 180) / Math.PI;
    console.log('🚀 Aqui *** -> angle', angle);
  }
}

function getSlope(x1: number, y1: number, x2: number, y2: number) {
  return (y2 - y1) / (x2 - x1);
}

function getMinMaxPoints(inputUnders: any[]) {
  let min = inputUnders[0].value;
  let max = inputUnders[0].value;
  let minUnder = inputUnders[0];
  let maxUnder = inputUnders[0];

  for (let i = 1; i < inputUnders.length; i++) {
    if (inputUnders[i].value < min) {
      min = inputUnders[i].value;
      minUnder = inputUnders[i];
    }
    if (inputUnders[i].value > max) {
      max = inputUnders[i].value;
      maxUnder = inputUnders[i];
    }
  }

  if (new Date(maxUnder.date).getTime() > new Date(minUnder.date).getTime()) {
    return [minUnder, maxUnder];
  }
  return [maxUnder, minUnder];
}

async function simulate(match: GenericObject) {
  const externalId = match.externalId;
  let prediction: GenericObject = {};
  let underProportion;
  let invertedCones: GenericObject[] = [];
  let upsDowns: GenericObject = {};
  let upsDownsDanger = false;
  let isFirstBet = true;
  const filteredUnders = match.unders.filter((el: { quarter: string }) => {
    return el.quarter !== 'c4';
  });
  let accumulatedUnders: GenericObject[] = [];
  const {
    fromQuarter,
    untilQuarter,
    fromTime,
    untilTime,
    minUnderPercent,
    hasUnderBeatOver,
    minimalScoreDifference,
    minimalUpsDownsDifference,
    hasInvertedCones,
    moneyBet,
    moneyNextBet,
    minimalDifferenceToNextBet,
  } = variables.value;

  if (hasInvertedCones[0] && hasInvertedCones[1]) {
    invertedCones = getInvertedCones(
      match.unders.filter((el: { quarter: string }) => el.quarter != 'c4'),
      match.teams.some((el: { name: string }) => hasAvoidedTeam(el.name))
        ? 9
        : 12,
    );
    console.log('🐞 LOG HERE invertedCones:', invertedCones);
  }
  if (
    minimalUpsDownsDifference[0] ||
    (minimalUpsDownsDifference[0] && minimalUpsDownsDifference[1])
  ) {
    upsDowns = getUpsDowns(filteredUnders);
    console.log(
      'Ups downs: ',
      upsDowns.upsCounterPercent,
      upsDowns.downsCounterPercent,
      upsDowns.upsCounterPercent - upsDowns.downsCounterPercent,
    );
    if (
      upsDowns.upsCounterPercent - upsDowns.downsCounterPercent >=
      parseFloat(minimalUpsDownsDifference[1])
    ) {
      upsDownsDanger = true;
    }
  }

  for (const under of match.unders) {
    accumulatedUnders.push(under);
    if (under.quarter == 'c4') {
      if (
        !match.teams.some((el: { name: string }) => hasAvoidedTeam(el.name)) ||
        (match.teams.some((el: { name: string }) => hasAvoidedTeam(el.name)) &&
          under.millis &&
          under.millis != 0 &&
          under.millis < 7 * 60 * 1000)
      ) {
        if (
          match.teams.some((el: { name: string }) => hasAvoidedTeam(el.name)) &&
          under.millis &&
          under.millis != 0 &&
          under.millis < 7 * 60 * 1000
        ) {
          invertedCones = getInvertedCones(
            accumulatedUnders,
            match.teams.some((el: { name: string }) => hasAvoidedTeam(el.name))
              ? 12
              : 12,
          );
        }
        const underScore = under.value;
        // if (match.slug && !history[externalId] && minUnderPercent[0]) {
        //   if (match.history) {
        //     history[externalId] = match.history;
        //   } else {
        //     history[externalId] = await getHistoryScore24(
        //       [],
        //       new Date(),
        //       match.slug,
        //       2020,
        //     );
        //     await $store.dispatch('matchesModule/update', {
        //       id: match._id,
        //       data: { history: history[externalId] },
        //     });
        //   }
        // }
        // if (match.slug) {
        //   let historyMatches = history[externalId];
        //   if (historyMatches && historyMatches.length > 0 && underScore) {
        //     let totals = [];
        //     let totalSum = 0;
        //     let unders = 0;
        //     for (let i = 0; i < historyMatches.length; i++) {
        //       let [score1, score2] = historyMatches[i].resultScore.split(':');
        //       score1 = parseInt(score1);
        //       score2 = parseInt(score2);
        //       totals.push(score1 + score2);
        //       totalSum += score1 + score2;
        //       if (score1 + score2 < underScore) {
        //         unders++;
        //       }
        //     }

        //     const totalAvg = totalSum / historyMatches.length;
        //     underProportion = (unders / totals.length).toFixed(2);
        //     const underPercent = (underProportion * 100).toFixed(2);
        //     const totalQty = totals.length;
        //     const underQty = unders;

        //     prediction = {
        //       underPercent,
        //       totalAvg,
        //       totalQty,
        //       underQty,
        //     };
        //   }
        // }
        const quarter = under.quarter;
        const basketClockMillis = under.millis;
        const underQuota = under.underQuota;
        const overQuota = under.overQuota;
        const scores = under.scores;

        let quarterNumber = parseInt(quarter[1].match(/\d+/)[0]);
        // if (
        //   hasInvertedCones[0] ||
        //   (hasInvertedCones[0] && hasInvertedCones[1])
        // ) {
        // }

        const underConditions = [
          {
            isActive: fromQuarter[0] && untilQuarter[0],
            condition:
              quarterNumber &&
              quarterNumber >= fromQuarter[1].match(/\d+/)[0] &&
              quarterNumber <= untilQuarter[1].match(/\d+/)[0],
          },
          {
            isActive: fromTime[0] && untilTime[0],
            condition:
              ((quarter == fromQuarter[1]
                ? basketClockMillis <= parseInt(fromTime[1])
                : true) &&
                (quarter == untilQuarter[1]
                  ? basketClockMillis >= parseInt(untilTime[1])
                  : true)) ||
              (quarter == 'c4' &&
                (basketClockMillis === 0 || !basketClockMillis)),
          },
          {
            isActive: minUnderPercent[0],
            condition:
              prediction.underPercent &&
              prediction.underPercent >= parseFloat(minUnderPercent[1]),
          },
          {
            isActive: hasUnderBeatOver[0],
            condition: hasUnderBeatOver[1]
              ? underQuota >= overQuota
              : underQuota <= overQuota,
          },
          // {
          //   isActive: minimalScoreDifference[0],
          //   condition:
          //     minimalScoreDifference[1] && scores
          //       ? Math.abs(scores[0] -.scoresDetailed.away) >=
          //         parseInt(minimalScoreDifference[1])
          //       : true,
          // },
          {
            isActive: hasInvertedCones[0],
            condition:
              hasInvertedCones[0] && hasInvertedCones[1]
                ? invertedCones.length == 0
                : true,
          },
        ];
        const underOptionalConditions = [];

        let betsByMatch = bets.value.filter((el) => el.matchId == match._id);
        if (upsDowns.upsCounterPercent - upsDowns.downsCounterPercent >= 0.24) {
          return;
        }
        if (
          ((upsDownsDanger ||
            match.teams.some((el: { name: string }) =>
              hasAvoidedTeam(el.name),
            )) &&
            betsByMatch.length > 0) ||
          match.teams.every((el: { name: string }) => hasAvoidedTeam(el.name))
        ) {
          return;
        }
        if (
          match.teams.some((el: { name: string }) =>
            hasMidAvoidedTeam(el.name),
          ) &&
          betsByMatch.length > 2
        ) {
          return;
        }
        if (
          !betsByMatch.find(
            (el) =>
              el.matchId === match._id &&
              el.type === 'U' &&
              el.score === underScore,
          )
        ) {
          let lastBetByMatch = betsByMatch[betsByMatch.length - 1];
          if (
            (!lastBetByMatch ||
              (lastBetByMatch &&
                lastBetByMatch.value <=
                  underScore -
                    (minimalDifferenceToNextBet[0]
                      ? parseInt(minimalDifferenceToNextBet[1])
                      : 2))) &&
            underConditions
              .filter((el) => el.isActive)
              .every((el, index) => {
                return el.condition;
              })
          ) {
            placeBet(
              match,
              underScore,
              'U',
              basketClockMillis,
              quarter,
              underQuota,
              overQuota,
              scores || [],
              underProportion,
              invertedCones.length ? invertedCones.length : 0,
              upsDowns
                ? upsDowns.upsCounterPercent - upsDowns.downsCounterPercent
                : 0,
              betsByMatch.length == 0 ? moneyBet[1] : moneyNextBet[1],
              isFirstBet,
            );
            if (isFirstBet) {
              isFirstBet = false;
            }
          }
        }
      }
    }
  }
}

function placeBet(
  match: any,
  value: any,
  type: string,
  basketClockMillis: any,
  quarter: any,
  underQuota: any,
  overQuota: any,
  scores: any,
  underProportion: string | undefined,
  invertedConesLength: number,
  upsDownsDifference: number,
  money: any,
  isFirstBet: boolean,
) {
  bets.value.push({
    matchId: match._id,
    value,
    type,
    millis: basketClockMillis,
    quarter: quarter,
    underQuota,
    overQuota,
    scores,
    historicalUnder: underProportion,
    match,
    invertedConesLength,
    upsDownsDifference,
    money,
    isFirstBet,
  });
}

function calculateWinrate(inputBets: GenericObject[]) {
  inputBets.forEach((bet: GenericObject, index: number) => {
    if (bet.type === 'U') {
      if (
        bet.value >
        bet.match.scoresDetailed.home + bet.match.scoresDetailed.away
      ) {
        unders.value.wins++;
        inputBets[index].win = true;
      } else {
        unders.value.losses++;
        inputBets[index].win = false;
      }
    } else {
      if (
        bet.value <
        bet.match.scoresDetailed.home + bet.match.scoresDetailed.away
      ) {
        overs.value.wins++;
      } else {
        overs.value.losses++;
      }
    }
  });
  unders.value.winrate = roundDecimal(
    unders.value.wins / filteredBets.value.length,
  );
  overs.value.winrate = roundDecimal(
    overs.value.wins / filteredBets.value.length,
  );
  winrate.value = roundDecimal(
    (unders.value.wins + overs.value.wins) / filteredBets.value.length,
  );
}

function resetValues() {
  bets.value = [];

  unders.value.wins = 0;
  unders.value.losses = 0;
  overs.value.wins = 0;
  overs.value.losses = 0;
}

function calculateBenefit() {
  variables.value.moneyBet[1] = parseFloat(variables.value.moneyBet[1]);
  variables.value.moneyNextBet[1] = parseFloat(variables.value.moneyNextBet[1]);
  initialMoney.value = filteredBets.value.reduce((acc, el) => {
    return acc + parseFloat(el.money);
  }, 0);
  finalMoney.value = roundDecimal(
    filteredBets.value.reduce((acc, bet) => {
      if (
        (bet.type === 'U' &&
          bet.value >
            bet.match.scoresDetailed.home + bet.match.scoresDetailed.away) ||
        (bet.type === 'O' &&
          bet.value <
            bet.match.scoresDetailed.home + bet.match.scoresDetailed.away)
      ) {
        acc += (bet.underQuota || 1.63) * parseFloat(bet.money);
      }
      return acc;
    }, 0),
  );
  profit.value = roundDecimal(
    (finalMoney.value - initialMoney.value) / initialMoney.value,
  );
}

function hasAvoidedTeam(team: string): boolean {
  // const avoidTeams = [
  //   'TOR Raptors',
  //   'OKC Thunder',
  //   'SAC Kings',
  //   'DET Pistons',
  //   'CHI Bulls',
  //   'UTA Jazz',
  //   'DAL Mavericks',
  //   'MIN Timberwolves',
  // ];

  const avoidTeams: string[] = [];

  return avoidTeams.includes(team);
}

function hasMidAvoidedTeam(team: string): boolean {
  // const avoidTeams = [
  //   'ORL Magic',
  //   'LA Lakers',
  //   'CHA Hornets',
  //   'MEM Grizzlies',
  //   'PHI 76ers',
  //   'LA Clippers',
  // ];

  const avoidTeams: string[] = [];
  return avoidTeams.includes(team);
}

function simulateByTeams() {
  window.open('/simulations-teams?');
  for (const team of $store.state['teamsModule'].teams) {
    $store.commit('simulationsModule/addSimulation', team);
  }
}

function isBetWinner(bet: GenericObject) {
  return (
    (bet.type === 'U' &&
      bet.value >
        bet.match.scoresDetailed.home + bet.match.scoresDetailed.away) ||
    (bet.type === 'O' &&
      bet.value < bet.match.scoresDetailed.home + bet.match.scoresDetailed.away)
  );
}
</script>

<style scoped></style>
