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
          <h6 class="d-inline">Cantidad de apuestas: {{ bets.length }}</h6>
          <div>
            <h6 class="d-inline">Winrate:</h6>
            {{ ((winrate || 0) * 100).toFixed(2) }}% ({{ unders.wins }}/{{
              bets.length
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
        <!-- <div class="col-sm-6">
          <div class="col-sm-4">
            <el-button small type="primary" plain @click="simulateByTeams"
              >Simular por equipo</el-button
            >
          </div>
        </div> -->
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
            <th scope="col">Cuarto</th>
            <th scope="col">Apostado</th>
            <th scope="col">Under Quota</th>
            <th scope="col">Beneficio</th>
            <th scope="col">Over Quota</th>
            <th scope="col">Score</th>
            <th scope="col">Cantidad de montañas</th>
            <th scope="col">Diferencia ups/downs %</th>
            <th scope="col">¿Primera apuesta?</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="bet.match?.hasOvertime ? 'table-danger' : ''"
            v-for="(bet, idx) in bets"
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
              {{ bet.type }} {{ bet.value }}
              {{ isBetWinner(bet) ? '✅' : '❌' }}
            </td>
            <td>
              {{ bet.quarter }} {{ millisToMinutesAndSeconds(bet.millis) }}
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
const selectedTeam = ref<string | null>(null);
const isCalculating = ref<boolean>(false);
const initialMoney = ref<number>(0);
const finalMoney = ref<number>(0);
const profit = ref<number>(0);
const delayTimer = ref<any>(0);
const bets = ref<any[]>([]);
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
      // reEvaluateAll();
    }, 500);
  },
  { deep: true },
);

onMounted(async () => {
  await initialize();
});

async function initialize() {
  isCalculating.value = true;
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
  // payload['teamId'] = '63dafd104745a2ac0fa3a1fa';
  const responses = await Promise.all([
    $store.dispatch('matchesModule/simulator', payload),
    $store.dispatch('teamsModule/list', {
      sort: 'name',
      order: 'asc',
      league: 'NBA',
    }),
  ]);
  matches.value = responses[0];
  bets.value = [];
  for (const match of matches.value) {
    bets.value.push(
      ...match.bets.map((bet: GenericObject) => ({ ...bet, match })),
    );
  }
  reEvaluateAll();
  isCalculating.value = false;
}

async function reEvaluateAll() {
  resetValues();
  calculateWinrate(filteredBets.value);
  calculateBenefit();
}

function resetValues() {
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
    bets.value.reduce((acc, bet) => {
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

function isBetWinner(bet: GenericObject) {
  return (
    (bet.type === 'U' &&
      bet.value >
        bet.match.scoresDetailed.home + bet.match.scoresDetailed.away) ||
    (bet.type === 'O' &&
      bet.value < bet.match.scoresDetailed.home + bet.match.scoresDetailed.away)
  );
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
</script>

<style scoped></style>
