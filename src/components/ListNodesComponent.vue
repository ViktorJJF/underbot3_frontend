<template>
  <div class="card-body">
    <div class="card bg-light">
      <NodeComponent v-for="node in orderedNodes" :node="node" :nodes="nodes" :key="node.dialog_node"></NodeComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject, computed, PropType, toRefs, watch } from 'vue';
import type { GenericObject } from '@/types/GenericObject';
import NodeComponent from '@/components/NodeComponent.vue';

const props = defineProps({
  nodes: { type: Object as PropType<GenericObject>, default: () => ({}) },
  firstNode: { type: Object as PropType<GenericObject>, default: () => ({}) },
});

const { nodes, firstNode } = toRefs(props);

let orderedNodes = ref<GenericObject[]>([]);

// watch(nodes, (newNodes, oldNodes) => {
//   if (newNodes !== oldNodes) {
//     orderedNodes.value.push(firstNode.value);
//     if (firstNode.value && firstNode.value.next_sibling) {
//       evaluateNextNode(firstNode.value.next_sibling);
//     }
//   }
// });

onMounted(() => {
  orderedNodes.value.push(firstNode.value);
  evaluateNextNode(firstNode.value.next_sibling);
});

function evaluateNextNode(dialog_node: string) {
  if (dialog_node) {
    orderedNodes.value.push(nodes.value[dialog_node]);
    evaluateNextNode(nodes.value[dialog_node].next_sibling);
  }
}
</script>

<style lang="scss" scoped></style>
