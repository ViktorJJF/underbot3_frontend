<template>
  <div>
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

import { computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const $route = useRoute();
const $store = useStore();

const bettingOdds = ref<GenericObject[]>([]);
const match = ref<GenericObject>({});

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
    $store.dispatch('matchesModule/listOne', $route.params.id),
    $store.dispatch('bettingOddsModule/list', {
      // sort: 'createdAt',
      // order: 'asc',
      // league: 'NBA',
      matchId: $route.params.id,
      type: 'Principal',
      name: 'Totales (incl. prórroga)',
    }),
  ]);
  match.value = await promises[0];
  bettingOdds.value = await promises[1];
  // console.log('data: ', data);
}
</script>

<style scoped></style>
