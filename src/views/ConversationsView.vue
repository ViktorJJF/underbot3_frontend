<template>
    <div class="row">
        <div class="col-7">
            <div class="card box-margin">
                <div class="card-body">
                    <div class="row my-3">
                        <div class="col-sm-12 col-md-5">
                            <div class="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">
                                Mostrando {{
                                    $store.state.itemsPerPage > conversations.length
                                    ? conversations.length
                                    : $store.state.itemsPerPage
                                }}
                                de {{ $store.state.conversationsModule.total }} registros</div>
                        </div>
                        <div class="col-sm-12 col-md-7">
                            <el-pagination v-model:current-page="page" @current-change="initialize(page)" background
                                layout="pager" :total="$store.state.conversationsModule.total"
                                :page-size="$store.state.itemsPerPage" />
                        </div>
                    </div>
                    <div class="basic-table-area">
                        <!--Basic Table-->
                        <el-table border stripe :data="conversations" style="width: 100%">
                            <el-table-column label="Fecha creación" prop="created_at">
                                <template #default="scope">
                                    <span>{{ $formatDate(scope.row.created_at, 'dd/MM/yyyy HH:mm') }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="session_id" prop="session_id" />
                            <el-table-column align="right">
                                <template #header>
                                    <el-input v-model="search" placeholder="Búsquedas..." clearable />
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="primary"
                                        @click="getMessages(scope.row.session_id)">Detalles</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--End Basic Table-->
                    </div>
                    <div class="row my-3">
                        <div class="col-sm-12 col-md-5">
                            <div class="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">
                                Mostrando {{
                                    $store.state.itemsPerPage > conversations.length
                                    ? conversations.length
                                    : $store.state.itemsPerPage
                                }}
                                de {{ $store.state.conversationsModule.total }} registros</div>
                        </div>
                        <div class="col-sm-12 col-md-7">
                            <el-pagination v-model:current-page="page" @current-change="initialize(page)" background
                                layout="pager" :total="$store.state.conversationsModule.total"
                                :page-size="$store.state.itemsPerPage" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-5">
            <div class="card box-margin">
                <div class="card-body">
                    <el-progress v-if="loadingMessages" :percentage="100" status="success" :indeterminate="true"
                        :duration="3" />
                    <div v-else class="mb-3" v-for="(message, idy) in messages" :key="idy">
                        <div><b>De: </b>{{ message.from_ }}</div>
                        <div><b>Texto: </b>{{ message.text || 'PARTE FLUJO DIALOGO' }}</div>
                        <div v-if="message.is_generated_llm"><b>LLM?: </b>{{ message.is_generated_llm ? 'Sí' : 'No' }}</div>
                        <div v-if="message.tool"><b>Tool: </b>{{ message.tool }}</div>
                        <div v-if="message.intents?.length"><b>Intenciones LLM: </b>{{ message.intents }}</div>
                        <div v-if="message.intent_semantic?.length"><b>Intent Semantic Search: </b>{{
                            message.intent_semantic }}</div>
                        <div v-if="message.entities?.length"><b>Entidades: </b>{{ message.entities.map(el => el.entity) }}
                        </div>

                    </div>
                    <h4 v-if="!loadingMessages && (!messages || !messages.length)">Sin mensajes</h4>
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
import messagesService from '@/services/api/messages'

// plugins
const $formatDate: any = inject('$formatDate');
const $deepCopy: any = inject('$deepCopy');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
const conversations = ref<GenericObject[]>([]);
const messages = ref<GenericObject[]>([]);
// Pagination
const pagination = ref<GenericObject>({});
const page = ref<number>(1);
const pageCount = ref<number>(0);
// Search
const fieldsToSearch = ref<string[]>(['session_id']);
const search = ref<string>('');
// Others
const loadingButton = ref<boolean>(false);
const loadingMessages = ref<boolean>(false);
const delayTimer = ref<any>(null);
const editedIndex = ref<number>(-1);

const dialog = ref<boolean>(false);

const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Crear Conversation' : 'Editar Conversation';
});

const assistant_id = computed<string>(() => {
    return $route.query.assistant_id as string;
});

watch(search, () => {
    clearTimeout(delayTimer.value);
    delayTimer.value = setTimeout(() => {
        page.value = 1;
        initialize(page.value);
    }, 600);
});

onMounted(() => {
    initialize();
});

async function initialize(pageNumber: number = 1): Promise<any> {
    let payload = {
        page: page.value || pageNumber,
        search: search.value,
        fieldsToSearch: fieldsToSearch.value,
        sort: 'created_at',
        order: 'desc',
        assistant_id: assistant_id.value,
    };
    await Promise.all([$store.dispatch('conversationsModule/list', payload)]);
    conversations.value = $deepCopy($store.state.conversationsModule.conversations);
}

async function close() {
    dialog.value = false;
}

function getMessages(session_id: string) {
    loadingMessages.value = true
    messagesService.list({ session_id, sort: 'created_at', order: 'asc' }, assistant_id.value).then((response) => {
        messages.value = response.data.payload
    }).catch((error) => {
        console.log(error)
    }).finally(() => {
        loadingMessages.value = false
    })
}
</script>
  
<style lang="scss" scoped></style>
  