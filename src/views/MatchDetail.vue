<template>
  <div>
    <div class="col-sm-3">
      <el-select
        v-model="selectedBettingOddName"
        placeholder="Tipo de apuesta"
        @change="initialize()"
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
    <MatchGraph
      v-if="Object.keys(match).length"
      :match="match"
      :bettingOdds="bettingOdds"
      :on-show-raw-data="showRawData"
    />
    <h1>detalles... {{ $route.params.id }}</h1>

    <!-- Raw Data Modal -->
    <el-dialog
      v-model="showRawMatchModal"
      title="Datos Raw del Partido"
      width="60%"
      :destroy-on-close="true"
    >
      <pre class="raw-json"><code>{{ JSON.stringify(rawMatchData, null, 2) }}</code></pre>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="showRawMatchModal = false">Cerrar</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import MatchGraph from '../components/MatchGraph.vue';
import type { GenericObject } from '@/types/GenericObject';
import MatchesService from '@/services/api/matches';

import { computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const $route = useRoute();
const $store = useStore();

const bettingOdds = ref<GenericObject[]>([]);
const match = ref<GenericObject>({});
const bettingOddsNames = ref<string[]>([]);
const selectedBettingOddName = ref<string>('Totales (incl. prórroga)');

// Raw data modal state
const showRawMatchModal = ref<boolean>(false);
const rawMatchData = ref<GenericObject | null>(null);

const formattedUnders = computed(() => {
  return bettingOdds.value.map((under: GenericObject) => {
    return {
      value: '',
      quarter: '',
      millis: '',
      date: '',
      underQuota: '',
      overQuota: '',
      scores: '',
    };
  });
});

onMounted(() => {
  console.log('Ruta actual: ', $route.params.id);
  initialize();
});

async function initialize(): Promise<any> {
  const promises = await Promise.all([
    $store.dispatch('matchesModule/listOne', {
      id: $route.params.id,
      query: {
        betName: selectedBettingOddName.value,
      },
    }),
  ]);
  match.value = await promises[0];
  MatchesService.listBetNames(false, [match.value._id]).then((res) => {
    bettingOddsNames.value = res.data.payload;
  });
  bettingOdds.value = match.value.odds;
  // console.log('data: ', data);
}

function showRawData(match: GenericObject): void {
  rawMatchData.value = match;
  showRawMatchModal.value = true;
}
</script>

<style scoped>
/* Raw JSON Modal Styles */
.raw-json {
  max-height: 60vh;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}

.raw-json code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #333;
}
</style>
