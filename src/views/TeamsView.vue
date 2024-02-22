<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <button
            type="button"
            class="btn btn-primary mb-2 mr-2"
            @click="
              close();
              dialog = true;
            "
          >
            Nuevo
          </button>
          <div class="row my-3">
            <div class="col-sm-12 col-md-5">
              <div
                id="datatable-buttons_info"
                class="dataTables_info"
                role="status"
                aria-live="polite"
              >
                Mostrando
                {{
                  $store.state.itemsPerPage > teams.length
                    ? teams.length
                    : $store.state.itemsPerPage
                }}
                de {{ $store.state.teamsModule.total }} registros
              </div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination
                v-model:current-page="page"
                background
                layout="pager"
                :total="$store.state.teamsModule.total"
                :page-size="$store.state.itemsPerPage"
                @current-change="initialize(page)"
              />
            </div>
          </div>
          <div class="basic-table-area">
            <!--Basic Table-->
            <el-table border stripe :data="teams" style="width: 100%">
              <el-table-column label="Fecha creación" prop="createdAt">
                <template #default="scope">
                  <span>{{ $formatDate(scope.row.createdAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Nombre" prop="name" />
              <el-table-column align="right">
                <template #header>
                  <el-input
                    v-model="search"
                    placeholder="Búsquedas..."
                    clearable
                  />
                </template>
                <template #default="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="editItem(scope.row)"
                  >
                    Editar
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteItem(scope.row)"
                  >
                    Borrar
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--End Basic Table-->
          </div>
          <div class="row my-3">
            <div class="col-sm-12 col-md-5">
              <div
                id="datatable-buttons_info"
                class="dataTables_info"
                role="status"
                aria-live="polite"
              >
                Mostrando
                {{
                  $store.state.itemsPerPage > teams.length
                    ? teams.length
                    : $store.state.itemsPerPage
                }}
                de {{ $store.state.teamsModule.total }} registros
              </div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination
                v-model:current-page="page"
                background
                layout="pager"
                :total="$store.state.teamsModule.total"
                :page-size="$store.state.itemsPerPage"
                @current-change="initialize(page)"
              />
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog = false">Cancelar</el-button>
          <el-button type="success" :loading="loadingButton" @click="save">
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
import Team from '@/models/Teams';
import { ElMessageBox } from 'element-plus';

// plugins
const $formatDate: any = inject('$formatDate');
const $deepCopy: any = inject('$deepCopy');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
const teams = ref<GenericObject[]>([]);
const editedItem = ref<GenericObject>(Team());
const defaultItem = ref<GenericObject>(Team());
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
  return editedIndex.value === -1 ? 'Crear team' : 'Editar team';
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
    sort: 'createdAt',
    order: 'desc',
    league: 'NBA',
  };
  await Promise.all([$store.dispatch('teamsModule/list', payload)]);
  teams.value = $deepCopy($store.state.teamsModule.teams);
}

async function save() {
  loadingButton.value = true;
  if (editedIndex.value > -1) {
    let id = teams.value[editedIndex.value]._id;
    try {
      await $store.dispatch('teamsModule/update', {
        id,
        data: editedItem.value,
      });
      Object.assign(teams.value[editedIndex.value], editedItem.value);
      close();
    } finally {
      loadingButton.value = false;
    }
  } else {
    //create item
    try {
      let newItem = await $store.dispatch(
        'teamsModule/create',
        editedItem.value,
      );
      teams.value.push(newItem);
      close();
      initialize();
    } finally {
      loadingButton.value = false;
    }
  }
}

function editItem(item: GenericObject) {
  editedIndex.value = teams.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

async function deleteItem(item: GenericObject) {
  const index = teams.value.indexOf(item);
  let id = teams.value[index]._id;
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
    await $store.dispatch('teamsModule/delete', id);
    teams.value.splice(index, 1);
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
