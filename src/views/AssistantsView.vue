<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <button type="button" class="btn btn-primary mb-2 mr-2"
            @click="
              close();
            dialog = true;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ">
            Crear Asistente
          </button>
          <div class="row my-3">
            <div class="col-sm-12 col-md-5">
              <div class="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">Mostrando {{
                $store.state.itemsPerPage > assistants.length
                ? assistants.length
                : $store.state.itemsPerPage
              }}
                de {{ $store.state.assistantsModule.total }} registros</div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination v-model:current-page="page" @current-change="initialize(page)" background layout="pager"
                :total="$store.state.assistantsModule.total" :page-size="$store.state.itemsPerPage" />
            </div>
          </div>
          <div class="basic-table-area">
            <!--Basic Table-->
            <el-table border stripe :data="assistants" style="width: 100%">
              <el-table-column label="Fecha creación" prop="created_at">
                <template #default="scope">
                  <span>{{ $formatDate(scope.row.created_at) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="assistant_id" prop="assistant_id" />
              <el-table-column label="Nombre" prop="name" />
              <el-table-column align="right">
                <template #header>
                  <el-input v-model="search" placeholder="Búsquedas..." clearable />
                </template>
                <template #default="scope">
                  <el-button size="small" type="primary" @click="editItem(scope.row)">Editar</el-button>
                  <el-button size="small" type="primary" color="#5E00D9" @click="
                    $router.push({
                      path: `/assistants/statistics`,
                      query: {
                        assistant_id: scope.row.assistant_id,
                      },
                    });">Entrenamiento</el-button>
                  <el-button size="small" type="danger" @click="deleteItem(scope.row)">Borrar</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--End Basic Table-->
          </div>
          <div class="row my-3">
            <div class="col-sm-12 col-md-5">
              <div class="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">Mostrando {{
                $store.state.itemsPerPage > assistants.length
                ? assistants.length
                : $store.state.itemsPerPage
              }}
                de {{ $store.state.assistantsModule.total }} registros</div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination v-model:current-page="page" @current-change="initialize(page)" background layout="pager"
                :total="$store.state.assistantsModule.total" :page-size="$store.state.itemsPerPage" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialog" :title="formTitle" width="30%">
      <el-form label-position="top" label-width="100px">
        <el-form-item label="Nombre">
          <el-input v-model="editedItem.name" />
        </el-form-item>
        <el-form-item label="Webhook">
          <el-input v-model="editedItem.webhooks[0].url" />
        </el-form-item>
        <el-form-item label="Bot_id relacionado">
          <el-input v-model="editedItem.bot_id" />
        </el-form-item>
        <el-form-item label="Watson skill_id">
          <el-input v-model="editedItem.watson_skill_id" />
        </el-form-item>
        <el-form-item label="Watson api_key">
          <el-input v-model="editedItem.watson_api_key" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog = false">Cancelar</el-button>
          <el-button type="success" @click="save" :loading="loadingButton">
            Guardar
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import type { GenericObject } from '@/types/GenericObject';
import Asssitant from '@/models/Assistants';
import { ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

// plugins
const $formatDate: any = inject('$formatDate');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
const assistants = ref<GenericObject[]>([]);
const editedItem = ref<GenericObject>(Asssitant());
const defaultItem = ref<GenericObject>(Asssitant());
// Pagination
const pagination = ref<GenericObject>({});
const page = ref<number>(1);
const pageCount = ref<number>(0);
// Search
const fieldsToSearch = ref<string[]>(['name']);
const search = ref<string>('');
// Others
const loadingButton = ref<boolean>(false);
const delayTimer = ref<any>(null);
const editedIndex = ref<number>(-1);

const dialog = ref<boolean>(false);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Crear Asistente' : 'Editar Asistente';
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
  };
  await Promise.all([$store.dispatch('assistantsModule/list', payload)]);
  const preAssistants = $store.state.assistantsModule.assistants;
  for (let assistant of preAssistants) {
    if (!assistant.webhooks) {
      assistant.webhooks = [{
        "headers": [],
        "name": "main_webhook",
        "url": ""
      }]
    }
  }
  assistants.value = $store.state.assistantsModule.assistants;
}

async function save() {
  loadingButton.value = true;
  if (editedIndex.value > -1) {
    let assistant_id = assistants.value[editedIndex.value].assistant_id;
    try {
      await $store.dispatch('assistantsModule/update', {
        id: assistant_id,
        data: editedItem.value,
      });
      Object.assign(assistants.value[editedIndex.value], editedItem.value);
      close();
    } finally {
      loadingButton.value = false;
    }
  } else {
    //create item
    try {
      let newItem = await $store.dispatch(
        'assistantsModule/create',
        editedItem.value,
      );
      assistants.value.push(newItem);
      close();
      initialize();
    } finally {
      loadingButton.value = false;
    }
  }
}

function editItem(item: GenericObject) {
  editedIndex.value = assistants.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

async function deleteItem(item: GenericObject) {
  const index = assistants.value.indexOf(item);
  let assistant_id = assistants.value[index].assistant_id;
  if (
    await ElMessageBox.confirm(
      '¿Realmente deseas eliminar este registro?',
      'Confirmación',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      },
    )
  ) {
    await $store.dispatch('assistantsModule/delete', assistant_id);
    assistants.value.splice(index, 1);
  }
}

async function close() {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  }, 300);
}
</script>

<style lang="scss" scoped></style>
