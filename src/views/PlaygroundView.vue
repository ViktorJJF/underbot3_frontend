<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <div class="row" v-if="!bot">
            <h3>Bot no existe</h3>
          </div>
          <div class="row" v-else>
            <div class="col-xs-12 col-sm-8">
              <div><b>Bot </b> {{ assistant.name }}</div>
              <div><b>Bot ID Databot: </b> {{ assistant.bot_id }}</div>
              <div><b>assistant_id: </b> {{ assistant.assistant_id }}</div>
              <div><b>Sesión actual: </b> {{ session_id }}</div>
              <div><b>Modelo: </b> {{ session_id }}</div>
              <el-select v-model="model" disabled placeholder="Modelo">
                <el-option label="gpt-3.5-turbo-0301" value="gpt-3.5-turbo-0301" :disabled="true" />
              </el-select>
              <div class="mt-3">
                <h5>Prompt tokens: {{ promptTokens }}</h5>
              </div>
              <div>
                <h5>Completion tokens: {{ completionTokens }}</h5>
              </div>
              <div>
                <h5>Total para sesión activa: {{ promptTokens + completionTokens }}</h5>
              </div>
              <div>
                <h5>Costo para sesión activa: {{ (((promptTokens + completionTokens) / 1000) * 0.002).toFixed(4) }} usd
                </h5>
              </div>
              <h5>Solicitudes API LLM</h5>
              <el-table :data="llmTracker" style="width: 100%">
                <el-table-column prop="is_stream" label="Stream?" width="180" />
                <el-table-column prop="status_request" label="Código Respuesta" width="180">
                  <template #default="scope">
                    <span v-if="scope.row.status_request === '200'" class="badge badge-soft-success">200 OK</span>
                    <span v-if="scope.row.status_request === '408'" class="badge badge-soft-warning">408 Timeout</span>
                    <span v-if="scope.row.status_request === '500'" class="badge badge-soft-danger">500 Error</span>
                  </template>
                </el-table-column>
                <el-table-column prop="response_time" label="Tiempo respuesta(segs)" width="180">
                  <template #default="scope">
                    <ul>
                      <li>{{ scope.row.response_time }} </li>
                      <li v-show="scope.row.is_stream">{{ scope.row.response_time_before_stream }} antes de stream
                      </li>
                    </ul>
                  </template>
                </el-table-column>
                <el-table-column prop="total_tokens" label="Tokens" />
                <el-table-column prop="response" label="Detalle">
                  <template #default="scope">
                    <el-button size="small" type="primary"
                      @click="selectedLlmTracker = scope.row; dialogDetails = true;">Ver
                      detalle</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div v-if="playgroundType === 'bot'" class="col-xs-12 col-sm-4">
              <el-button size="small" type="primary" @click="remountIframe += 1">Recargar iframe bot</el-button>
              <div class="preview"><iframe :key="remountIframe" class="expand"
                  :src="`${config.DATABOT_BOT_URL}/bot?id=${bot.id}&token=${bot.token}&clientPathName=${pathname}&clientHostName=${hostname}&isPlayground=true&assistant_id=${reversedAssistantId}&playground_bot_id=${assistant.bot_id}`"></iframe>
              </div>
            </div>
            <div v-else class="col-xs-12 col-sm-4">
              <el-input class="mb-2" v-model="searchProduct" placeholder="Búsqueda para recomendación" clearable
                @keyup.enter="search" />
              <el-button type="primary" @click="search" :loading="loadingButton">Buscar</el-button>
              <el-checkbox class="ml-3" v-model="useLlm">{{ useLlm ? 'Usar LLM para búsqueda' : 'Sin LLM' }}</el-checkbox>
              <el-table :data="products" stripe style="width: 100%">
                <el-table-column label="Imagen" prop="image_url">
                  <template #default="scope">
                    <img :src="scope.row.image_url" alt="Imagen" width="100" height="100" />
                  </template>
                </el-table-column>
                <el-table-column label="Nombre" prop="name">
                  <template #default="scope">
                    <span>{{ scope.row.name }}</span>
                    link
                    <div>
                      <a :href="scope.row.product_url" target="_blank">Ver</a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Categorías" prop="categories" />
                <el-table-column label="Disponible" prop="available" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogDetails"
      :title="'Detalles de solicitud a LLM ' + (selectedLlmTracker.is_stream ? '(Solicitud stream final)' : '(Solicitud intermedia)')"
      width="50%">
      <el-form label-position="top" label-width="100px">
        <h5>Consumo de tokens: </h5>
        <ul class="mb-3">
          <li>prompt_tokens: {{ selectedLlmTracker.prompt_tokens }} </li>
          <li>completion_tokens: {{ selectedLlmTracker.completion_tokens }} </li>
          <li>Total: {{ selectedLlmTracker.total_tokens }} </li>
        </ul>
        <el-card shadow="never" class="box-card mb-2">
          <template #header>
            <div class="">
              <h5>Variables de entrada</h5>
              <ul>
                <li v-for="(value, key) in selectedLlmTracker.input_variables" :key="key">
                  <b>- {{ key }}</b>:<br />
                  <pre>{{ value }}</pre>
                </li>
              </ul>
            </div>
          </template>
        </el-card>
        <el-card shadow="never" class="box-card mb-2">
          <template #header>
            <div class="">
              <h5>Prompt</h5>
            </div>
          </template>
          <pre>{{ selectedLlmTracker.prompt }}</pre>
        </el-card>
        <el-card shadow="never" class="box-card mb-2">
          <template #header>
            <div class="">
              <h5>Respuesta</h5>
            </div>
          </template>
          <pre>{{ selectedLlmTracker.response }}</pre>
        </el-card>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" @click="dialogDetails = false">
            Listo
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted, computed, inject, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import type { GenericObject } from '@/types/GenericObject';
import config from '@/config';

const isDev: boolean = import.meta.env.DEV
// plugins
const $formatDate: any = inject('$formatDate');
const $deepCopy: any = inject('$deepCopy');
const $uuid: any = inject('$uuid');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();

let messageListener: any;
// Entity
const assistant = ref<GenericObject>({});
const bot = ref<GenericObject>({});
const session_id = ref<string>('');
const promptTokens = ref<number>(0);
const completionTokens = ref<number>(0);
const countApiRequests = ref<number>(0);
const llmTracker = ref<GenericObject[]>([]);
const selectedLlmTracker = ref<GenericObject>({});
const products = ref<GenericObject[]>([]);
const model = ref<string>('gpt-3.5-turbo-0301');
const useLlm = ref<boolean>(true);
// Others
const loadingButton = ref<boolean>(false);
const delayTimer = ref<any>(null);
const remountIframe = ref<number>(0);
const dialogDetails = ref<boolean>(false);
const playgroundType = ref<string>('');
const searchProduct = ref<string>('');


const assistant_id = computed<string>(() => {
  return $route.query.assistant_id as string;
});

const pathname = computed<string>(() => {
  return window.location.pathname as string;
});

const hostname = computed<string>(() => {
  return window.location.hostname as string;
});

const reversedAssistantId = computed<string>(() => {
  return assistant_id.value.split('').reverse().join('')
});

watch(llmTracker, () => {
  if (llmTracker.value.length === 0) {
    clear()
  }
});

// function to be called when the route changes
let handleRouteChange = (newRoute: any) => {
  clear()
  if (newRoute.fullPath.includes('recommender')) {
    playgroundType.value = 'recommender'
    session_id.value = $uuid()
  } else {
    playgroundType.value = 'bot'
  }
};

// watch for changes in the route
watch($route, handleRouteChange, { deep: true, immediate: true });

onMounted(() => {
  // check current route
  initialize();

  // Remove previous listener if exists
  if (messageListener) {
    window.removeEventListener('message', messageListener);
  }

  // Define and attach new listener
  messageListener = (e: any) => {
    const { event, payload } = e.data;
    if (event === 'message_sent') {
      console.log("BOT TERMINO DE ESCRIBIR...", payload);
      session_id.value = payload.session_id
      getTokenUsage(session_id.value)
      getLogLlmTracker(session_id.value)
    }
  }

  window.addEventListener('message', messageListener);


});

onUnmounted(() => {
  if (messageListener) {
    window.removeEventListener('message', messageListener);
  }
});

async function initialize(): Promise<any> {
  assistant.value = await $store.dispatch(
    'assistantsModule/listOne',
    assistant_id.value,
  );
  getBotInfo(isDev ? 1 : 1954) // id bot para demos en prod
}

async function getBotInfo(botId: number): Promise<any> {
  axios.get(config.DATABOT_DASHBOARD_BACKEND_URL + `/get_bot_info/${botId}`).then(res => {
    bot.value = res.data
  })
}

async function getTokenUsage(session_id: string): Promise<any> {
  const response = await $store.dispatch('llmTrackerModule/getTotalTokens', { by: 'session', session_id: session_id })
  if (response.ok) {
    console.log('🚀 Aqui *** -> TOKEN USAGE:', response);
    promptTokens.value = response.payload.prompt_tokens
    completionTokens.value = response.payload.completion_tokens
  }
}

async function getLogLlmTracker(session_id: string): Promise<any> {
  llmTracker.value = await $store.dispatch("llmTrackerModule/list", { session_id })
}

function clear() {
  llmTracker.value = []
  selectedLlmTracker.value = {}
  dialogDetails.value = false
  promptTokens.value = 0
  completionTokens.value = 0
  countApiRequests.value = 0
}

async function search() {
  if (searchProduct.value.length > 0) {
    loadingButton.value = true
    const result = await $store.dispatch('productsModule/search', { query: searchProduct.value, session_id: session_id.value, useLlm: useLlm.value })
    products.value = result.payload
    getTokenUsage(session_id.value)
    getLogLlmTracker(session_id.value)
    loadingButton.value = false
  }
}

</script>

<style lang="scss" scoped>
.preview {
  width: 500px;
  height: 800px;
}

iframe {
  display: block;
  border: none;
  width: 400px !important;
  max-height: 675px !important;
  min-height: 240px !important;
  height: 100% !important;
}

.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
