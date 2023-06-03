<template>
  <div class="card-body">
    <div class="card bg-light">

      <div class="card-header border-bottom-0">
        <div><b>dialog_node</b>: {{ node.dialog_node }}</div>
        <div><b>Tipo: </b>{{ node.type }}</div>
        <div><b>Condiciones:</b> {{ node.conditions }}</div>
        <h5><b>{{ node.title }}</b> </h5>
      </div>
      <div class="card-body">

        <p class="card-text">
        <div>{{ node }}</div>
        <div v-if="node.output"><b>Respuestas:</b> {{ node?.output?.generic }}</div>
        <div><b>Anterior: </b>dialog_node: {{ node.previous_sibling }}</div>
        <div><b>Siguiente: </b>dialog_node: {{ node.next_sibling }}</div>
        <div v-if="node.first_response_condition_child">
          <h6 class="mt-3">Listado hijos condicional</h6>
          <ListNodesComponent :firstNode="nodes[node.first_response_condition_child]" :nodes="nodes"></ListNodesComponent>
        </div>
        <div v-if="node.first_child">
          <h6 class="mt-3">Listado hijos</h6>
          <ListNodesComponent :firstNode="nodes[node.first_child]" :nodes="nodes"></ListNodesComponent>
        </div>
        <div v-if="node.first_slot_child">
          <h6 class="mt-3">Listado slots hijos</h6>
          <ListNodesComponent :firstNode="nodes[node.first_slot_child]" :nodes="nodes"></ListNodesComponent>
        </div>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject, computed, PropType, toRefs } from 'vue';
import type { GenericObject } from '@/types/GenericObject';
import NodeComponent from '@/components/NodeComponent.vue';
import ListNodesComponent from '@/components/ListNodesComponent.vue';


const props = defineProps({
  node: { type: Object as PropType<GenericObject>, default: () => ({}) },
  nodes: { type: Object as PropType<GenericObject>, default: () => ({}) },
});


</script>

<style lang="scss" scoped></style>