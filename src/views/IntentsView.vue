<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <el-button type="primary" color="#5E00D9" class="mb-2" @click="
            close();
          dialog = true;">
            Crear Intent
          </el-button>
          <div class="row my-3">
            <div class="col-sm-12 col-md-5">
              <div class="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">Mostrando {{
                $store.state.itemsPerPage > intents.length
                ? intents.length
                : $store.state.itemsPerPage
              }}
                de {{ $store.state.intentsModule.total }} registros</div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination v-model:current-page="page" @current-change="initialize(page)" background layout="pager"
                :total="$store.state.intentsModule.total" :page-size="$store.state.itemsPerPage" />
            </div>
          </div>
          <div class="basic-table-area">
            <!--Basic Table-->
            <el-table border stripe :data="intents" style="width: 100%">
              <el-table-column label="Fecha actualización" prop="created_at">
                <template #default="scope">
                  <span>{{ $formatDate(scope.row.updated_at, 'dd/MM/yyyy HH:mm') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Nombre" prop="intent" />
              <el-table-column label="Descripción" prop="description" />
              <el-table-column label="Ejemplos" prop="examples">
                <template #default="scope">
                  <span>{{ scope.row.examples?.length }}</span>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template #header>
                  <el-input v-model="search" placeholder="Búsquedas..." clearable />
                </template>
                <template #default="scope">
                  <el-button size="small" type="primary" @click="editItem(scope.row)">Editar</el-button>
                  <el-button size="small" type="danger" @click="deleteItem(scope.row)">Borrar</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--End Basic Table-->
          </div>
          <div class="row my-3">
            <div class="col-sm-12 col-md-5">
              <div class="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">Mostrando {{
                $store.state.itemsPerPage > intents.length
                ? intents.length
                : $store.state.itemsPerPage
              }}
                de {{ $store.state.intentsModule.total }} registros</div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination v-model:current-page="page" @current-change="initialize(page)" background layout="pager"
                :total="$store.state.intentsModule.total" :page-size="$store.state.itemsPerPage" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialog" :title="formTitle" width="30%">
      <el-form label-position="top" label-width="100px">
        <el-form-item label="Nombre">
          <el-input v-model="editedItem.intent" />
        </el-form-item>
        <el-form-item label="Descripción">
          <el-input type="textarea" autosize v-model="editedItem.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain type="danger" @click="dialog = false">Cancelar</el-button>
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
import Intent from '@/models/Intents';
import { ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

// plugins
const $formatDate: any = inject('$formatDate');
const $deepCopy: any = inject('$deepCopy');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
const intents = ref<GenericObject[]>([]);
const editedItem = ref<GenericObject>(Intent());
const defaultItem = ref<GenericObject>(Intent());
// Pagination
const pagination = ref<GenericObject>({});
const page = ref<number>(1);
const pageCount = ref<number>(0);
// Search
const fieldsToSearch = ref<string[]>(['intent']);
const search = ref<string>('');
// Others
const loadingButton = ref<boolean>(false);
const delayTimer = ref<any>(null);
const editedIndex = ref<number>(-1);

const dialog = ref<boolean>(false);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Crear Intent' : 'Editar Intent';
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
    sort: 'updated_at',
    order: 'desc',
  };
  await Promise.all([$store.dispatch('intentsModule/list', payload)]);
  intents.value = $deepCopy($store.state.intentsModule.intents);
}

async function save() {
  loadingButton.value = true;
  if (editedIndex.value > -1) {
    let id = intents.value[editedIndex.value]._id;
    try {
      await $store.dispatch('intentsModule/update', {
        id,
        data: editedItem.value,
      });
      Object.assign(intents.value[editedIndex.value], editedItem.value);
      close();
    } finally {
      loadingButton.value = false;
    }
  } else {
    //create item
    try {
      let newItem = await $store.dispatch(
        'intentsModule/create',
        editedItem.value,
      );
      intents.value.push(newItem);
      close();
      initialize();
    } finally {
      loadingButton.value = false;
    }
  }
}

function editItem(item: GenericObject) {
  editedIndex.value = intents.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

async function deleteItem(item: GenericObject) {
  const index = intents.value.indexOf(item);
  let id = intents.value[index]._id;
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
    await $store.dispatch('intentsModule/delete', id);
    intents.value.splice(index, 1);
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
