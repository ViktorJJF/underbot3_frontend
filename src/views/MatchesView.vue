<template>
  <div>
    <div class="container-fluid px-2 px-md-3 py-1">
      <!-- View Mode Toggle -->
      <div class="row mb-3">
        <div class="col-12">
          <el-radio-group v-model="viewMode" @change="onViewModeChange" class="view-mode-toggle">
            <el-radio-button label="date">Filtrar por fecha</el-radio-button>
            <el-radio-button label="latest">Últimos partidos</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- Date Filter View -->
      <div v-if="viewMode === 'date'">
        <div class="row mb-2">
          <div class="col-12 col-md-auto mb-2 mb-md-0">
            <el-button class="w-100 w-md-auto" type="primary" @click="showAllLeagues"
              >Mostrar todas las ligas</el-button
            >
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-12 col-md-6 col-lg-4 mb-2">
            <el-select
              v-model="selectedBettingOddName"
              placeholder="Tipo de apuesta"
              @change="onSelectBettingOddName($event)"
              clearable
              class="w-100"
            >
              <el-option
                v-for="(name, idxBettingOddName) in bettingOddsNames"
                :key="idxBettingOddName"
                :label="name"
                :value="name"
              />
            </el-select>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <el-date-picker
              @change="getMatchesByDate()"
              v-model="date"
              type="date"
              placeholder="Selecciona un día"
              size="large"
              class="w-100"
            />
          </div>
        </div>
        <div class="mt-3 leagues-container">
          <el-tag
            v-for="league in leagues"
            :key="league"
            class="league-tag mb-2"
            effect="dark"
            :type="selectedLeagues.includes(league) ? 'success' : 'info'"
            round
            @click="selectLeague(league)"
            >{{ league }}</el-tag
          >
          <el-divider />
        </div>
      </div>

      <!-- Latest Matches View -->
      <div v-else>
        <div class="row mb-3">
          <div class="col-12 col-md-6 col-lg-3">
            <label class="d-block mb-1">Partidos por página:</label>
            <el-select v-model="latestMatchesLimit" @change="loadLatestMatches" class="w-100">
              <el-option :value="15" label="15"></el-option>
              <el-option :value="30" label="30"></el-option>
              <el-option :value="50" label="50"></el-option>
              <el-option :value="100" label="100"></el-option>
            </el-select>
          </div>
        </div>
        
        <!-- Pagination Top -->
        <div class="row mb-3">
          <div class="col-12">
            <PaginationComponent
              :current-page="latestMatchesPage"
              :page-size="latestMatchesLimit"
              :total="totalMatches"
              :show-total="!isMobile"
              :has-next-page="hasNextPage"
              @page-change="handleLatestPageChange"
            />
          </div>
        </div>
      </div>

      <!-- Matches Grid -->
      <div class="row mt-3 g-2 g-md-3">
        <div class="col-12 col-md-6 col-xl-4" v-for="match in matches" :key="match._id">
          <MatchGraph :match="match" :bettingOdds="match.odds" :showLeague="viewMode === 'latest'"></MatchGraph>
        </div>
      </div>

      <!-- Pagination Bottom -->
      <div v-if="viewMode === 'latest'" class="row mt-3">
        <div class="col-12">
          <PaginationComponent
            :current-page="latestMatchesPage"
            :page-size="latestMatchesLimit"
            :total="totalMatches"
            :show-total="!isMobile"
            :has-next-page="hasNextPage"
            @page-change="handleLatestPageChange"
          />
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
import { ref, onMounted, computed, inject, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import type { GenericObject } from '@/types/GenericObject';
import { ElMessageBox } from 'element-plus';
import MatchGraph from '@/components/MatchGraph.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
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
const viewMode = ref<string>('date');
const latestMatchesPage = ref<number>(1);
const latestMatchesLimit = ref<number>(15);
const totalMatches = ref<number>(0);
const hasNextPage = ref<boolean>(false);
const windowWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

const dialog = ref<boolean>(false);

// Computed for responsive behavior
const isMobile = computed(() => windowWidth.value < 768);

// Handle window resize
function handleResize(): void {
  windowWidth.value = window.innerWidth;
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

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

// Helper function to get local date string in YYYY-MM-DD format
function getLocalDateString(inputDate: Date): string {
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

onMounted(() => {
  // Add resize listener for responsive behavior
  window.addEventListener('resize', handleResize);

  // Check if view mode is latest
  if ($route?.query?.view === 'latest') {
    viewMode.value = 'latest';
    // Restore page and limit from query params if available
    if ($route.query.page) {
      latestMatchesPage.value = parseInt($route.query.page as string);
    }
    if ($route.query.limit) {
      latestMatchesLimit.value = parseInt($route.query.limit as string);
    }
    loadLatestMatches();
    return;
  }

  // Handle date view mode
  if ($route?.query?.leagues) {
    const leaguesFromQuery = $route.query.leagues;
    selectedLeagues.value = Array.isArray(leaguesFromQuery)
      ? (leaguesFromQuery as string[])
      : [leaguesFromQuery as string];
  }
  if ($route?.query?.bet_name) {
    selectedBettingOddName.value = $route.query.bet_name as string;
  }
  if ($route?.query?.date) {
    // Parse date string as local date (not UTC)
    const dateStr = $route.query.date as string;
    const [year, month, day] = dateStr.split('-').map(Number);
    date.value = new Date(year, month - 1, day);
  }
  // push initialized variables to query params
  $router.push({
    query: {
      leagues: selectedLeagues.value,
      bet_name: selectedBettingOddName.value,
      date: getLocalDateString(date.value),
    },
  });
  initialize();
});

async function initialize(pageNumber: number = 1): Promise<any> {
  // Format date to UTC timezone at 05:00:00 as expected by the API
  // Use local date values, not UTC, so user's selected date is used
  const formatDateForAPI = (inputDate: Date) => {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T05:00:00.000Z`;
  };

  // Format date range for leagues API (start and end of day in local timezone, converted to UTC)
  const getDateRangeUTC = (inputDate: Date) => {
    // Create start of day in local timezone
    const startOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 0, 0, 0, 0);

    // Create end of day in local timezone
    const endOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 23, 59, 59, 999);

    return {
      dateFrom: startOfDay.toISOString(),
      dateTo: endOfDay.toISOString(),
    };
  };

  const dateRange = getDateRangeUTC(date.value);

  let payload = {
    page: page.value || pageNumber,
    search: search.value,
    fieldsToSearch: fieldsToSearch.value,
    sort: 'createdAt',
    order: 'desc',
    limit: 15,
    dateFrom: formatDateForAPI(date.value),
    dateTo: formatDateForAPI(date.value),
    leagues: selectedLeagues.value,
    betName: selectedBettingOddName.value,
  };
  await Promise.all([$store.dispatch('matchesModule/list', payload)]);
  matches.value = $store.state.matchesModule.matches;
  MatchesService.listLeagues(true, dateRange.dateFrom, dateRange.dateTo).then((res) => {
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
  // Update query params with selected date
  $router.push({
    query: {
      leagues: selectedLeagues.value,
      bet_name: selectedBettingOddName.value,
      date: getLocalDateString(date.value),
    },
  });
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
  $router.push({
    query: {
      leagues: selectedLeagues.value,
      bet_name: selectedBettingOddName.value,
      date: getLocalDateString(date.value),
    },
  });
  initialize();
}

function onSelectBettingOddName(betName: string): void {
  selectedBettingOddName.value = betName;
  $router.push({
    query: {
      bet_name: selectedBettingOddName.value,
      leagues: selectedLeagues.value,
      date: getLocalDateString(date.value),
    },
  });
  initialize();
}

function onViewModeChange(): void {
  if (viewMode.value === 'latest') {
    // Clear query params when switching to latest view
    $router.push({
      query: {
        view: 'latest',
      },
    });
    loadLatestMatches();
  } else {
    // Restore date view with current filters
    $router.push({
      query: {
        leagues: selectedLeagues.value,
        bet_name: selectedBettingOddName.value,
        date: getLocalDateString(date.value),
      },
    });
    initialize();
  }
}

async function loadLatestMatches(): Promise<void> {
  // Update query params
  $router.push({
    query: {
      view: 'latest',
      page: latestMatchesPage.value.toString(),
      limit: latestMatchesLimit.value.toString(),
    },
  });

  const payload = {
    page: latestMatchesPage.value,
    sort: 'createdAt',
    order: 'desc',
    limit: latestMatchesLimit.value,
  };
  await $store.dispatch('matchesModule/list', payload);
  matches.value = $store.state.matchesModule.matches;
  totalMatches.value = $store.state.matchesModule.total;
  
  // Always assume there might be a next page since we don't know the total
  // The API will return empty results when we reach the end
  hasNextPage.value = matches.value.length === latestMatchesLimit.value;
}

function handleLatestPageChange(newPage: number): void {
  latestMatchesPage.value = newPage;
  loadLatestMatches();
}
</script>

<style lang="scss" scoped>
/* Mobile-first responsive styles */
.view-mode-toggle {
  width: 100%;

  :deep(.el-radio-button__inner) {
    width: 100%;
  }
}

.leagues-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.league-tag {
  margin: 0 4px 4px 0;
  cursor: pointer;
}

/* Ensure el-select and el-date-picker are full width on mobile */
:deep(.el-select),
:deep(.el-date-editor) {
  width: 100% !important;
}

/* Mobile styles */
@media (max-width: 767.98px) {
  .view-mode-toggle {
    :deep(.el-radio-button) {
      flex: 1;
    }

    :deep(.el-radio-button__inner) {
      padding: 8px 12px;
      font-size: 13px;
    }
  }

  .league-tag {
    font-size: 12px;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .view-mode-toggle {
    width: auto;
  }

  :deep(.el-select),
  :deep(.el-date-editor) {
    width: 100% !important;
  }
}
</style>
