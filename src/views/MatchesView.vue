<template>
  <div>
    <div class="container py-1">
      <el-button class="my-2" type="primary" @click="showAllLeagues"
        >Mostrar todas las ligas</el-button
      >
      <div class="col-sm-3">
        <el-select
          v-model="selectedBettingOddName"
          placeholder="Tipo de apuesta"
          @change="onSelectBettingOddName($event)"
          clearable
        >
          <el-option
            v-for="(name, idxBettingOddName) in bettingOddsNames"
            :key="idxBettingOddName"
            :label="name"
            :value="name"
          />
        </el-select>
      </div>
      <div class="row">
        <el-date-picker
          @change="getMatchesByDate()"
          v-model="date"
          type="date"
          placeholder="Selecciona un día"
          size="large"
        />
      </div>
      <div class="mt-3">
        <el-tag
          v-for="league in leagues"
          :key="league"
          class="mx-1 leagues-selector mb-2"
          effect="dark"
          :type="selectedLeagues.includes(league) ? 'success' : 'info'"
          round
          @click="selectLeague(league)"
          >{{ league }}</el-tag
        >
        <el-divider />
      </div>
      <div class="row mt-3">
        <div class="col-sm-6" v-for="match in matches" :key="match._id">
          <MatchGraph :match="match" :bettingOdds="match.odds"></MatchGraph>
        </div>
      </div>
    </div>
    <!-- <el-dialog
      v-model="dialog"
      v-if="dialog"
      :title="`${selectedMatch?.teams[0].name} - ${selectedMatch?.teams[1].name}`"
      width="30%"
    >
      <div v-if="selectedMatch?.slug">
        <span>Últimos juegos</span>
        <div class="row">
          <div class="col-sm-6">
            <b>Puntaje Under</b>
            <el-input
              v-model="underScore"
              placeholder="Ingresa un valor under"
            />
          </div>
        </div>
        <el-button
          class="mt-2"
          type="primary"
          @click="
            getHistoryUnderPercent(selectedMatch, underScore, {
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
                  underScore ||
                  selectedMatch.unders[selectedMatch.unders.length - 1].value
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
                  (underScore ||
                    selectedMatch.unders[selectedMatch.unders.length - 1].value)
                    ? '✅'
                    : '❌'
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <div class="col-sm-12">
          <b>Ingresa el slug del match para obtener la data histórica</b>
          <el-input
            v-model="matchSlug"
            placeholder="Formato -> 13-10-2022-la-clippers-denver-nuggets"
          />
          <el-button
            class="mt-2"
            type="success"
            @click="saveSlug(selectedMatch, matchSlug)"
            >Guardar</el-button
          >
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialog = false">Listo!</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import type { GenericObject } from '@/types/GenericObject';
import { ElMessageBox } from 'element-plus';
import MatchGraph from '@/components/MatchGraph.vue';
import MatchesService from '@/services/api/matches';

// plugins
const $formatDate: any = inject('$formatDate');
const $deepCopy: any = inject('$deepCopy');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
const matches = ref<GenericObject[]>([]);
// Pagination
const pagination = ref<GenericObject>({});
const page = ref<number>(1);
const pageCount = ref<number>(0);
// Search
const fieldsToSearch = ref<string[]>(['name']);
const search = ref<string>('');
// Others
const loadingButton = ref<boolean>(false);
const delayTimer = ref<any>(null);
const editedIndex = ref<number>(-1);
const leagues = ref<string[]>([]);
const bettingOddsNames = ref<string[]>([]);
const selectedBettingOddName = ref<string>('Totales (incl. prórroga)');
const selectedLeagues = ref<string[]>([]);
const selectedMatch = ref<GenericObject | null>(null);
const prediction = ref<GenericObject | null>(null);
const date = ref<Date>(new Date());

const dialog = ref<boolean>(false);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Crear match' : 'Editar match';
});

const new_odd = computed(() => $store.state.matchesModule.new_odd);

watch(search, () => {
  clearTimeout(delayTimer.value);
  delayTimer.value = setTimeout(() => {
    page.value = 1;
    initialize(page.value);
  }, 600);
});
// watch matchesModule
watch(
  new_odd,
  (newValue) => {
    // console.log('🐞 LOG HERE newValue:', newValue);
    const { matchId, bettingOdds } = newValue;
    // search match to append bettingOdds
    const match = matches.value.find((el) => el._id === matchId);
    // if (match) {
    //   match.odds.push(...bettingOdds);
    // }
  },
  { deep: true },
);

onMounted(() => {
  if ($route?.query?.leagues) {
    selectedLeagues.value = $route.query.leagues as string[];
  }
  if ($route?.query?.bet_name) {
    selectedBettingOddName.value = $route.query.bet_name as string;
  }
  // push initialized variables to query params
  $router.push({
    query: {
      leagues: selectedLeagues.value,
      bet_name: selectedBettingOddName.value,
    },
  });
  initialize();
});

async function initialize(pageNumber: number = 1): Promise<any> {
  let payload = {
    page: page.value || pageNumber,
    search: search.value,
    fieldsToSearch: fieldsToSearch.value,
    sort: 'createdAt',
    order: 'desc',
    limit: 15,
    dateFrom: date.value,
    dateTo: date.value,
    leagues: selectedLeagues.value,
    betName: selectedBettingOddName.value,
  };
  await Promise.all([$store.dispatch('matchesModule/list', payload)]);
  matches.value = $store.state.matchesModule.matches;
  MatchesService.listLeagues(true).then((res) => {
    leagues.value = res.data.payload;
  });
  MatchesService.listBetNames(
    true,
    matches.value.map((el) => el._id),
  ).then((res) => {
    bettingOddsNames.value = res.data.payload;
  });
}

function getMatchesByDate(): void {
  initialize();
}

function showAllLeagues(): void {
  window.open('/matches?leagues=all', '_self');
}

function selectLeague(league: string): void {
  if (selectedLeagues.value.includes(league)) {
    selectedLeagues.value = selectedLeagues.value.filter((el) => el !== league);
  } else {
    selectedLeagues.value.push(league);
  }
  if (selectedLeagues.value.length) {
    $router.push({
      query: {
        leagues: selectedLeagues.value,
        bet_name: selectedBettingOddName.value,
      },
    });
  }
  initialize();
}

function onSelectBettingOddName(betName: string): void {
  if (selectedBettingOddName.value) {
    $router.push({
      query: {
        bet_name: selectedBettingOddName.value,
        leagues: selectedLeagues.value,
      },
    });
  }
  selectedBettingOddName.value = betName;
  initialize();
}
</script>

<style lang="scss" scoped></style>
