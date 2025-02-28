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
    />
    <h1>detalles... {{ $route.params.id }}</h1>
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
</script>

<style scoped></style>
