<template>
  <div v-if="match && match.teams" class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">
        {{
          `${match.teams[0].name} (${match.scoresDetailed?.home ?? 0}) - (${match.scoresDetailed?.away ?? 0}) ${match.teams[1].name}`
        }}
      </h5>
      <div v-if="showLeague && match.league" class="league-badge mb-2">
        <span class="league-icon">🏆</span>
        <span class="league-text">{{ match.league }}</span>
      </div>
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Team / Total</th>
            <th v-for="(score, period) in match.periods" :key="period">
              {{ period }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ match.teams[0].name }}</td>
            <td
              v-for="(score, period) in match.periods"
              :key="period + '-home'"
            >
              {{ score.home }}
            </td>
          </tr>
          <tr>
            <td>{{ match.teams[1].name }}</td>
            <td
              v-for="(score, period) in match.periods"
              :key="period + '-away'"
            >
              {{ score.away }}
            </td>
          </tr>
          <tr>
            <td>Total</td>
            <td
              v-for="(score, period) in match.periods"
              :key="period + '-total'"
            >
              {{ score.home + score.away }}
            </td>
          </tr>
        </tbody>
      </table>
      <h6>ID: {{ match._id }}</h6>
      <h6>
        <a :href="`/matches/${match._id}`" target="_blank">{{
          match.externalId
        }}</a>
        <a v-if="match.sportsBookId" :href="`https://doradobet.com/deportes/partido/${match.sportsBookId}`" target="_blank">Doradobet {{ match.sportsBookId }}</a>
        - {{ formatDate(match.createdAt) }}
        <el-button
          class="ms-2"
          size="small"
          type="info"
          :icon="Document"
          circle
          @click="onShowRawData(match)"
          title="Ver datos raw"
        />
      </h6>
      <div class="row">
        <div class="col-sm-12 mb-2">
          <span v-show="match.basketClock !== 0" class="live-match">LIVE</span>
          <span v-show="match.isMatchOver" class="match-ended"
            >Juego Finalizado</span
          >
          <span
            v-show="match.isUnderOver && !match.isMatchOver"
            class="unders-ended"
            >Under Finalizado</span
          >
          <!-- Foul Counter Badge -->
          <span v-if="match.foulStats" class="foul-badge ms-2">
            <span class="foul-home" :class="{ 'danger': match.foulStats.home >= 4 }">{{ match.foulStats.home }}</span>
            <span class="foul-separator">F</span>
            <span class="foul-away" :class="{ 'danger': match.foulStats.away >= 4 }">{{ match.foulStats.away }}</span>
          </span>
        </div>
        <div class="col-sm-6">
          <h6>
            Total: {{ (match.scoresDetailed?.home ?? 0) + (match.scoresDetailed?.away ?? 0) }}
          </h6>
          <h6 v-if="match.underScore">
            Para alcanzar valor under:
            {{
              match.underScore -
              ((match.scoresDetailed?.home ?? 0) + (match.scoresDetailed?.away ?? 0))
            }}
          </h6>
          <h6>
            Tiempo:
            <span class="ml18-BasketballClock_TimerInnerWrapper"
              >{{ match.quarter }}
              {{ millisToMinutesAndSeconds(match.basketClock ?? 0) }}</span
            >
          </h6>
        </div>
        <div class="col-sm-6">
          <h6>
            O {{ match.underScore || 'Finalizado' }}
            <span class="ovm-ParticipantStackedCentered_Odds">{{
              match.overQuota
            }}</span>
          </h6>
          <h6>
            U {{ match.underScore || 'Finalizado' }}
            <span class="ovm-ParticipantStackedCentered_Odds">{{
              match.underQuota
            }}</span>
          </h6>
        </div>
        <!-- <div class="col-sm-8">
          <span class="subtitle">Under histórico:</span>
          {{
            getHistoryUnderPercent(
              match,
              match.unders.length > 0
                ? match.unders[match.unders.length - 1].value
                : 0,
              { returnMsg: true, sendAlert: true },
            )
          }}
        </div> -->
        <div class="col-sm-4">
          <el-button small type="success" plain>Predecir under</el-button>
        </div>
        <div class="col-12 mt-2">
          <el-button
            size="small"
            :type="showEventsLocal ? 'primary' : 'info'"
            plain
            @click="toggleEvents"
          >
            {{ showEventsLocal ? 'Ocultar eventos' : 'Ver eventos en vivo' }}
          </el-button>
        </div>
      </div>
      <div class="graph">
        <ECharts class="chart item" :option="option" autoresize />
      </div>

    </div>

    <!-- Match Events Modal -->
    <el-dialog
      v-model="showEventsLocal"
      :title="`Eventos: ${match.teams[0]?.name} vs ${match.teams[1]?.name}`"
      width="90%"
      :fullscreen="isMobile"
      destroy-on-close
    >
      <MatchEvents
        :match-id="match._id"
        :home-team-name="match.teams[0]?.name || 'Home'"
        :away-team-name="match.teams[1]?.name || 'Away'"
        :show-foul-stats="true"
        :initial-events="match.matchEvents || []"
        :initial-foul-stats="match.foulStats || { home: 0, away: 0 }"
      />
      <template #footer>
        <el-button type="primary" @click="showEventsLocal = false">Cerrar</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialog"
      v-if="dialog"
      :title="`${match.teams[0].name} - ${match.teams[1].name}`"
      width="30%"
    >
      <!-- <div v-if="match.slug">
        <span>Últimos juegos</span>
        <div class="row">
          <div class="col-sm-6">
            <b>Puntaje Under</b>
            <el-input
              v-model="underScore"
              placeholder="Ingresa un valor under"
            />
          </div>
          <div class="col-sm-6">
            <b>Últimos X encuentros</b>
            <el-input
              v-model="matchesQty"
              placeholder="Ingresa con cuántos encuentros calcular"
            />
          </div>
        </div>
        <el-button
          class="mt-2"
          type="primary"
          @click="
            getHistoryUnderPercent(match, underScore, {
              maxItems: matchesQty,
            })
          "
          >Calcular</el-button
        >
        <div v-if="prediction">
          <div>
            <b>Porcentaje Under: </b>
            <span>{{ prediction.underPercent }} %</span>
          </div>
          <div>
            <b>Puntaje promedio: </b> <span>{{ prediction.totalAvg }}</span>
          </div>
          <div>
            <b>Total unders: </b>
            <span>{{ prediction.underQty }} de {{ prediction.totalQty }}</span>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Fecha</th>
              <th scope="col"></th>
              <th scope="col">Total</th>
              <th scope="col">
                &#60;{{
                  underScore || match.unders[match.unders.length - 1].value
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(match, idx) in matchesQty && selectedHistory
                ? selectedHistory.slice(0, matchesQty)
                : selectedHistory"
              :key="idx"
            >
              <th scope="row">{{ idx + 1 }}</th>
              <td>{{ match.matchDate }}</td>
              <td>
                {{ match.resultScore }}
              </td>
              <td>
                {{
                  match.resultScore
                    .split(':')
                    .map((el) => parseInt(el))
                    .reduce((el, acc) => el + acc, 0)
                }}
              </td>
              <td>
                {{
                  match.resultScore
                    .split(':')
                    .map((el) => parseInt(el))
                    .reduce((el, acc) => el + acc, 0) <
                  (underScore || match.unders[match.unders.length - 1].value)
                    ? '✅'
                    : '❌'
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->
      <!-- <div v-else>
        <div class="col-sm-12">
          <b>Ingresa el slug del match para obtener la data histórica</b>
          <el-input
            v-model="matchSlug"
            placeholder="Formato -> 13-10-2022-la-clippers-denver-nuggets"
          />
          <el-button
            class="mt-2"
            type="success"
            @click="saveSlug(match, matchSlug)"
            >Guardar</el-button
          >
        </div>
      </div> -->
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialog = false">Listo!</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue';
import { Document } from '@element-plus/icons-vue';
import MatchEvents from '@/components/MatchEvents.vue';

import ECharts from 'vue-echarts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {
  millisToMinutesAndSeconds,
  formatDate,
  formatBettingOdds,
} from '@/utils/utils';
import type { GenericObject } from '@/types/GenericObject';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const props = defineProps({
  match: {
    type: Object as PropType<GenericObject>,
    required: true,
    default: () => null,
  },
  name: {
    type: String as PropType<string>,
    default: 'chart',
  },
  bettingOdds: {
    type: Array as PropType<GenericObject[]>,
    default: () => [],
  },
  showLeague: {
    type: Boolean,
    default: false,
  },
  onShowRawData: {
    type: Function as PropType<(match: GenericObject) => void>,
    required: true,
  },
  showEvents: {
    type: Boolean,
    default: false,
  },
});

const dialog = ref<boolean>(false);
const history = ref<GenericObject>({});
const prediction = ref<GenericObject>({});
const matchSlug = ref<string>('');
const formattedBettingOdds = ref<GenericObject[]>([]);
const showEventsLocal = ref<boolean>(props.showEvents);
const windowWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

const isMobile = computed(() => windowWidth.value < 768);

function toggleEvents(): void {
  showEventsLocal.value = !showEventsLocal.value;
}
// const underScore = ref<number>(0);
// const matchesQty = ref<number>(0);

watch(
  () => props.bettingOdds,
  (newOdds, oldOdds) => {
    if (!oldOdds || oldOdds.length === 0) {
      // Initial load - format all odds
      formattedBettingOdds.value = formatBettingOdds(newOdds);
    } else if (newOdds.length > oldOdds.length) {
      // New odds added - only format and append the new ones
      const newItems = newOdds.slice(oldOdds.length);
      const formattedNewItems = formatBettingOdds(newItems);
      formattedBettingOdds.value.push(...formattedNewItems);
    } else {
      // Full replace (shouldn't happen often)
      formattedBettingOdds.value = formatBettingOdds(newOdds);
    }
  },
  { deep: true, immediate: true },
);

const xData = computed(() => {
  return formattedBettingOdds.value.map(
    (el: any) => el.quarter + ' ' + millisToMinutesAndSeconds(el.millis),
  );
});

const yData = computed(() => {
  return formattedBettingOdds.value.map((el: any) => ({
    value: el.value,
    scores: el.scores,
  }));
});

const quarterPoints = computed(() => {
  return getQuarterPoints();
});

const option = computed(() => {
  return {
    devicePixelRatio: window.devicePixelRatio || 2,
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `<div class="bet-tooltip">
            ${params[0].axisValue}<br/>${
          params[0].data.scores ? params[0].data.scores.join('-') : '-'
        }<br/>
            <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span>
            <span style="float:right;margin-left:10px;color:#666;font-weight:900">${
              params[0].data.value
            }</span>
             </div>`;
      },
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData.value,
      axisLabel: {
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} pts',
        fontSize: 11,
      },
      min:
        yData.value.length > 0
          ? Math.min(...yData.value.map((el: GenericObject) => el.value)) - 3
          : 0,
      max:
        yData.value.length > 0
          ? Math.max(...yData.value.map((el: GenericObject) => el.value)) + 3
          : 0,
      interval: 5,
    },
    series: [
      {
        type: 'line',
        emphasis: {
          focus: 'series',
        },
        data: yData.value,
        smooth: true,
        lineStyle: {
          width: 2,
        },
        symbolSize: 6,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' },
          ],
        },
        markLine: {
          lineStyle: {
            type: 'dotted',
            width: 1,
          },
          data: quarterPoints.value.map((el) => {
            return {
              xAxis: el.quarter + ' ' + millisToMinutesAndSeconds(el.millis),
              name: el.quarter,
              label: {
                formatter: el.quarter,
                position: 'end',
                fontSize: 11,
              },
              position: 'end',
            };
          }),
          // data: [{ type: "average", name: "Avg" }],
        },
        // markLine: {
        // },
      },
    ],
  };
});

function getHistoryUnderPercent(
  match: GenericObject,
  underScore: number,
  { returnMsg = false, sendAlert = false } = {},
) {
  const externalId = match.externalId;
  const historyMatches = match.history;
  history.value[match.externalId] = historyMatches;
  if (historyMatches && underScore) {
    let totals: number[] = [];
    let totalSum = 0;
    let unders = 0;
    for (let i = 0; i < historyMatches.length; i++) {
      let [score1, score2] = historyMatches[i].resultScore.split(':');
      score1 = parseInt(score1);
      score2 = parseInt(score2);
      totals.push(score1 + score2);
      totalSum += score1 + score2;
      if (score1 + score2 < underScore) {
        unders++;
      }
    }

    const totalAvg = totalSum / historyMatches.length;
    const underPercent = ((unders / totals.length) * 100).toFixed(2);
    const totalQty = totals.length;
    const underQty = unders;

    let matchPrediction = {
      underPercent,
      totalAvg,
      totalQty,
      underQty,
    };
    prediction.value = JSON.parse(JSON.stringify(matchPrediction));
    if (returnMsg) {
      return `En el ${underPercent}% (${underQty} de los últimos ${totalQty} partidos) el score final fue menor a ${underScore}`;
    }
    return {
      underPercent,
      totalAvg,
      totalQty,
      underQty,
    };
  }
}

// async function saveSlug(match, slug) {
//   await this.$store.dispatch('matchesModule/update', {
//     id: match._id,
//     data: { externalId: match.externalId, slug },
//   });
//   this.matchSlug = '';
// }

function getQuarterPoints() {
  let c1, c2, c3, c4;
  let point1, point2, point3, point4;
  for (const under of formattedBettingOdds.value) {
    let symbol = under.quarter;
    if (symbol === '0') continue;
    if (!c1 && symbol) {
      c1 = symbol;
      point1 = under;
    }
    if (!c2 && symbol !== c1) {
      c2 = symbol;
      point2 = under;
    }
    if (!c3 && symbol !== c1 && symbol !== c2) {
      c3 = symbol;
      point3 = under;
    }
    if (!c4 && symbol !== c1 && symbol !== c2 && symbol !== c3) {
      c4 = symbol;
      point4 = under;
    }
  }
  return [point1, point2, point3, point4]
    .filter((el) => el)
    .map((el: any) => ({ ...el, date: el.date }));
}
</script>

<style scoped>
/* Foul badge styles */
.foul-badge {
  display: inline-flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

.foul-home,
.foul-away {
  color: #333;
  min-width: 16px;
  text-align: center;
}

.foul-home.danger,
.foul-away.danger {
  color: #e74c3c;
  font-weight: 700;
}

.foul-separator {
  color: #999;
  margin: 0 4px;
  font-size: 10px;
}

/* Events section styles */
.events-section {
  border-top: 1px solid #eee;
  padding-top: 12px;
}

/* League badge styles */
.league-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in;
}

.league-icon {
  margin-right: 6px;
  font-size: 14px;
}

.league-text {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile-first responsive styles */
.card {
  overflow: hidden;
}

.card-body {
  padding: 12px;
}

.card-title {
  font-size: 14px;
  line-height: 1.3;
  word-break: break-word;
}

.table {
  font-size: 12px;
}

.table th,
.table td {
  padding: 4px 6px;
  white-space: nowrap;
}

.graph {
  width: 100%;
  overflow-x: auto;
}

.chart {
  min-width: 300px;
  height: 250px;
}

h6 {
  font-size: 12px;
  margin-bottom: 8px;
  word-break: break-word;
}

h6 a {
  word-break: break-all;
}

/* Tablet and up */
@media (min-width: 768px) {
  .card-body {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
  }

  .table {
    font-size: 14px;
  }

  .table th,
  .table td {
    padding: 8px;
  }

  .chart {
    height: 300px;
  }

  h6 {
    font-size: 14px;
  }
}
</style>
