<template>
  <div v-if="match && match.teams" class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">
        {{
          `${match.teams[0].name} (${match.scoresDetailed.home}) - (${match.scoresDetailed.away}) ${match.teams[1].name}`
        }}
      </h5>
      <h6>ID: {{ match._id }}</h6>
      <h6>
        <a :href="`/matches/${match._id}`" target="_blank">{{
          match.externalId
        }}</a>
        - {{ formatDate(match.createdAt) }}
      </h6>
      <div class="row">
        <div class="col-sm-12 mb-2">
          <span v-show="!match.isMatchOver" class="live-match">LIVE</span>
          <span v-show="match.isMatchOver" class="match-ended"
            >Juego Finalizado</span
          >
          <span
            v-show="match.isUnderOver && !match.isMatchOver"
            class="unders-ended"
            >Under Finalizado</span
          >
        </div>
        <div class="col-sm-6">
          <h6>
            Total: {{ match.scoresDetailed.home + match.scoresDetailed.away }}
          </h6>
          <h6 v-if="match.underScore">
            Para alcanzar valor under:
            {{
              match.underScore -
              (match.scoresDetailed.home + match.scoresDetailed.away)
            }}
          </h6>
          <h6>
            Tiempo:
            <span class="ml18-BasketballClock_TimerInnerWrapper"
              >{{ match.quarter }} {{ match.basketClock }}</span
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
        <div class="col-sm-8">
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
        </div>
        <div class="col-sm-4">
          <el-button small type="success" plain>Predecir under</el-button>
        </div>
      </div>
      <div class="graph">
        <ECharts class="chart item" :option="option" />
      </div>
    </div>
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
});

const dialog = ref<boolean>(false);
const history = ref<GenericObject>({});
const prediction = ref<GenericObject>({});
const matchSlug = ref<string>('');
const formattedBettingOdds = ref<GenericObject[]>([]);
// const underScore = ref<number>(0);
// const matchesQty = ref<number>(0);

watch(
  () => props.bettingOdds,
  () => {
    formattedBettingOdds.value = formatBettingOdds(props.bettingOdds);
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
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} pts',
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
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' },
          ],
        },
        markLine: {
          lineStyle: {
            type: 'dotted',
          },
          data: quarterPoints.value.map((el) => {
            return {
              xAxis: el.quarter + ' ' + millisToMinutesAndSeconds(el.millis),
              name: el.quarter,
              label: {
                formatter: el.quarter,
                position: 'end',
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
    let totals = [];
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

<style scoped></style>
