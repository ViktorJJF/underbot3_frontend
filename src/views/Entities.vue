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
          <div class="basic-table-area">
            <!--Basic Table-->
            <el-table border stripe :data="entities" style="width: 100%">
              <el-table-column label="Fecha creación" prop="created_at">
                <template #default="scope">
                  <span>{{ $formatDate(scope.row.created_at) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="assistant_id" prop="assistant_id" />
              <el-table-column label="Nombre" prop="name" />
              <el-table-column>
                <template #default="scope">
                  <el-button size="small" type="primary" @click="editItem(scope.row)">Editar</el-button>
                  <el-button size="small" type="primary" color="#5E00D9" @click="
                    $router.push({
                      path: `/entities/update`,
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
        </div>
      </div>
    </div>
    <el-dialog v-model="dialog" :title="formTitle" width="30%">
      <el-form label-position="top" label-width="100px">
        <el-form-item label="Nombre">
          <el-input v-model="editedItem.name" />
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
import { ref, onMounted, computed, inject } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import type { GenericObject } from '@/types/GenericObject';
import Entity from '@/models/Entities';
import { ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

// plugins
const $formatDate: any = inject('$formatDate');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
let entities = ref<GenericObject[]>([]);
let editedItem = ref<GenericObject>(Entity());
let defaultItem = ref<GenericObject>(Entity());
// Pagination
let pagination = ref<GenericObject>({});
let page = ref<number>(1);
let pageCount = ref<number>(0);
// Search
let fieldsToSearch = ref<string[]>(['name']);
let search = ref<string>('');
// Others
let loadingButton = ref<boolean>(false);
let delayTimer: any = null;
let editedIndex = ref<number>(-1);

let dialog = ref<boolean>(false);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Crear Asistente' : 'Editar Asistente';
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
    limit: 3000,
  };
  await Promise.all([$store.dispatch('entitiesModule/list', payload)]);
  entities.value = $store.state.entitiesModule.entities;
}

async function save() {
  loadingButton.value = true;
  if (editedIndex.value > -1) {
    let assistant_id = entities.value[editedIndex.value].assistant_id;
    try {
      await $store.dispatch('entitiesModule/update', {
        id: assistant_id,
        data: editedItem.value,
      });
      Object.assign(entities.value[editedIndex.value], editedItem.value);
      close();
    } finally {
      loadingButton.value = false;
    }
  } else {
    //create item
    try {
      let newItem = await $store.dispatch(
        'entitiesModule/create',
        editedItem.value,
      );
      entities.value.push(newItem);
      close();
      initialize();
    } finally {
      loadingButton.value = false;
    }
  }
}

function editItem(item: GenericObject) {
  editedIndex.value = entities.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

async function deleteItem(item: GenericObject) {
  const index = entities.value.indexOf(item);
  let assistant_id = entities.value[index].assistant_id;
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
    await $store.dispatch('entitiesModule/delete', assistant_id);
    entities.value.splice(index, 1);
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
