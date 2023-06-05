<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <div class="row" v-if="!bot">
            <h3>Bot no existe</h3>
          </div>
          <div class="row" v-else>
            <div class="col-sm-6">
              <div><b>Bot ID: </b> {{ assistant.bot_id }}</div>

            </div>

            <div class="col-sm-6">
              <div class="preview"><iframe class="expand"
                  :src="`https://databot-api.herokuapp.com/bot?id=${bot.id}&token=${bot.token}&clientPathName=${pathname}/&clientHostName=${hostname}`"></iframe>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import type { GenericObject } from '@/types/GenericObject';
import config from '@/config';
import axios from 'axios'

// plugins
const $formatDate: any = inject('$formatDate');
const $deepCopy: any = inject('$deepCopy');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
const assistant = ref<GenericObject>({});
const bot = ref<GenericObject>({});
// Others
const loadingButton = ref<boolean>(false);
const delayTimer = ref<any>(null);


const assistant_id = computed<string>(() => {
  return $route.query.assistant_id as string;
});

const pathname = computed<string>(() => {
  return window.location.pathname as string;
});

const hostname = computed<string>(() => {
  return window.location.hostname as string;
});


onMounted(() => {
  initialize();
});

async function initialize(): Promise<any> {
  assistant.value = await $store.dispatch(
    'assistantsModule/listOne',
    assistant_id.value,
  );
  getBotInfo(1954) // id bot para demos en prod
}

async function getBotInfo(botId: number): Promise<any> {
  console.log('🚀 Aqui *** -> botId:', botId);
  axios.get(config.DATABOT_DASHBOARD_BACKEND_URL + `/get_bot_info/${botId}`).then(res => {
    bot.value = res.data
  })
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
  height: 70vh;
  width: 100%;
}
</style>
