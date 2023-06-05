<template>
    <div class="row" :key="key">
        <div class="col-12">
            <div class="card box-margin">
                <ListNodesComponent v-if="firstNode" :firstNode="firstNode" :nodes="nodes"></ListNodesComponent>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import NodeComponent from '@/components/NodeComponent.vue';
import ListNodesComponent from '@/components/ListNodesComponent.vue';
import type { GenericObject } from '@/types/GenericObject';
import assistantService from '@/services/api/assistants';

// plugins
const $formatDate: any = inject('$formatDate');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();

let assistant = ref<GenericObject>({});
let nodes = ref<GenericObject>({});
let firstNode = ref<GenericObject | null>(null);
let orderedNodes = ref<GenericObject[]>([]);
const isTrainLoading = ref<boolean>(false);
const isSync = ref<boolean>(false);
const key = ref<number>(0);

const assistant_id = computed<string>(() => {
    return $route.query.assistant_id as string;
});

onMounted(() => {
    initialize();
});

async function initialize() {
    assistant.value = await $store.dispatch(
        'assistantsModule/listOne',
        assistant_id.value,
    );
    nodes.value = (
        await assistantService.getNodesHandler(assistant_id.value)
    ).data.payload;
    evaluateNodes(nodes);
    key.value += 1;
}

function evaluateNodes(nodes: GenericObject) {
    for (const key in nodes.value) {
        if (Object.prototype.hasOwnProperty.call(nodes.value, key)) {
            const node = nodes.value[key];
            if (!node.previous_sibling && !node.parent) {
                firstNode.value = node;
            }
        }
    }
}

async function train() {
    try {
        isTrainLoading.value = true;
        await $store.dispatch("assistantsModule/train", assistant_id.value)
    } catch (error) {
        console.error(error)
    } finally {
        isTrainLoading.value = false;
    }
}

async function syncWithWatson() {
    try {
        isSync.value = true;
        await $store.dispatch("assistantsModule/generateFromWatson", assistant_id.value)
        initialize()
    } catch (error) {
        console.error(error)
    } finally {
        isSync.value = false;
    }
}
</script>

<style lang="scss" scoped></style>
