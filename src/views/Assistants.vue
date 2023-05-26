<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <button
            type="button"
            class="btn btn-primary mb-2 mr-2"
            @click="dialog = true"
          >
            Crear Asistente
          </button>
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
              <el-table-column>
                <template #default="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="editItem(scope.row)"
                    >Editar</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteItem(scope.row)"
                    >Borrar</el-button
                  >
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
import type { GenericObject } from '@/types/GenericObject';
import Asssitant from '@/models/Assistants';
import { ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

// plugins
const $formatDate: Function | undefined = inject('$formatDate');
const store = useStore();

// Entity
let assistants = ref<GenericObject[]>([]);
let editedItem = ref<GenericObject>(Asssitant());
let defaultItem = ref<GenericObject>(Asssitant());
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
    sort: 'createdAt',
    order: 'desc',
    limit: 50,
  };
  await Promise.all([store.dispatch('assistantsModule/list', payload)]);
  assistants.value = store.state.assistantsModule.assistants;
}

async function save() {
  loadingButton.value = true;
  if (editedIndex.value > -1) {
    let itemId = assistants.value[editedIndex.value]._id;
    try {
      await store.dispatch('assistantsModule/update', {
        id: itemId,
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
      let newItem = await store.dispatch(
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
  let itemId = assistants.value[index]._id;
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
    await store.dispatch('assistantsModule/delete', itemId);
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
