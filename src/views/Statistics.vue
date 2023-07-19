<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <div><b>Asistente: </b>{{ assistant.name }}</div>
          <div><b>assistant_id: </b>{{ assistant.assistant_id }}</div>
          <el-button :disabled="!assistant.watson_skill_id || !assistant.watson_api_key" size="large" type="primary"
            color="#5E00D9" @click="syncWithWatson" :loading="isSync">Sincronizar con
            Watson {{ !assistant.watson_skill_id || !assistant.watson_api_key ? '(Faltan credenciales)' : ''
            }}</el-button>
          <el-button class="ml-3" size="large" type="primary" color="#5E00D9" @click="train"
            :loading="isTrainLoading">Train
            (Vectorizar)</el-button>
          <el-button size="large" type="primary" color="#5E00D9" @click="downloadJson" :loading="isTrainLoading">Descargar
            JSON</el-button>
          <a id="downloadLink" style="display: none">Download</a>
          <div class="row mt-3">
            <div class="col-sm-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="text-danger card-title">Tokens consumidos</h5>
                  <h4 class="text-center font-30 mb-0">{{ totalTokens }}
                  </h4>
                  <div class="d-flex justify-content-between mt-30">
                    <p class="">Prompt Tokens: {{ promptTokens }}</p>
                    <p class="">Completion Tokens: {{ completionTokens }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="text-danger card-title">Total USD</h5>
                  <h4 class="text-center font-30 mb-0"><i class="fa fa-money text-success mr-2 font-32"></i>${{
                    ((totalTokens / 1000) * 0.002).toFixed(3) }}
                  </h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'

import config from '@/config';
import { onMounted, ref, inject, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import type { GenericObject } from '@/types/GenericObject';

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
const promptTokens = ref<number>(0);
const completionTokens = ref<number>(0);

const assistant_id = computed<string>(() => {
  return $route.query.assistant_id as string;
});

const totalTokens = computed<number>(() => {
  return promptTokens.value + completionTokens.value
});

onMounted(() => {
  initialize();
});

async function initialize() {
  assistant.value = await $store.dispatch(
    'assistantsModule/listOne',
    assistant_id.value,
  );
  const response = await $store.dispatch('llmTrackerModule/getTotalTokens', { by: 'assistant', assistant_id: assistant_id.value })
  promptTokens.value = response.payload.prompt_tokens
  completionTokens.value = response.payload.completion_tokens
  key.value += 1;
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

async function downloadJson() {
  const response = await axios.get(
    config.BACKEND_BASE_URL + '/api/assistants/' + assistant_id.value, {
    params: {
      export: true
    }
  }
  )
  const assistantJson = response.data.payload
  // sanitize json to upload to watson
  const dialog_nodes = assistantJson.dialog_nodes
  for (const dialog_node of dialog_nodes) {
    const type = dialog_node.type
    if (type !== 'frame' || type !== 'standard') {
      delete dialog_node['disambiguation_opt_out']
    }
  }
  assistantJson.dialog_nodes = dialog_nodes
  // start downloading json
  const blob = new Blob([JSON.stringify(assistantJson)], { type: 'application/json' }); // create a blob object
  const url = URL.createObjectURL(blob); // create a URL for that blob

  // get the download link element
  const link = document.getElementById('downloadLink') as HTMLAnchorElement;

  link.href = url;
  link.download = `${assistant.value.name}.json`; // specify the filename for the download
  link.style.display = 'block'; // make it visible

  // trigger click event programmatically
  link.click();

  // After a delay, clean up the URL we created. This also hides the link again.
  setTimeout(() => {
    URL.revokeObjectURL(url);
    link.style.display = 'none';
  }, 100);
}
</script>

<style lang="scss" scoped></style>
