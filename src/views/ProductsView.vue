<template>
  <div class="row">
    <div class="col-12">
      <div class="card box-margin">
        <div class="card-body">
          <el-button type="primary" color="#5E00D9" class="mb-2" @click="
            close();
          dialog = true;">
            Crear Producto
          </el-button>
          <div class="row my-3">
            <div class="col-sm-12 col-md-5">
              <div class="dataTables_info" id="datatable-buttons_info" role="status" aria-live="polite">Mostrando {{
                $store.state.itemsPerPage > products.length
                ? products.length
                : $store.state.itemsPerPage
              }}
                de {{ $store.state.productsModule.total }} registros</div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination v-model:current-page="page" @current-change="initialize(page)" background layout="pager"
                :total="$store.state.productsModule.total" :page-size="$store.state.itemsPerPage" />
            </div>
          </div>
          <div class="basic-table-area">
            <!--Basic Table-->
            <el-table border stripe :data="products" style="width: 100%">
              <el-table-column label="Fecha actualización" prop="created_at">
                <template #default="scope">
                  <span>{{ $formatDate(scope.row.updated_at, 'dd/MM/yyyy HH:mm') }}</span>
                </template>
              </el-table-column>
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
              <el-table-column label="Descripción">
                <template #default="scope">
                  <div v-if="scope.row.description.length > 50">
                    <div v-if="showMoreDescription[scope.row._id]">
                      {{ scope.row.description }}
                      <el-button @click="showMoreDescription[scope.row._id] = false">Show less</el-button>
                    </div>
                    <div v-else>
                      {{ scope.row.description.substring(0, 50) }}...
                      <el-button @click="showMoreDescription[scope.row._id] = true">Show more</el-button>
                    </div>
                  </div>
                  <div v-else>
                    {{ scope.row.description }}
                  </div>
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
                $store.state.itemsPerPage > products.length
                ? products.length
                : $store.state.itemsPerPage
              }}
                de {{ $store.state.productsModule.total }} registros</div>
            </div>
            <div class="col-sm-12 col-md-7">
              <el-pagination v-model:current-page="page" @current-change="initialize(page)" background layout="pager"
                :total="$store.state.productsModule.total" :page-size="$store.state.itemsPerPage" />
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
import Product from '@/models/Products';
import { ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

// plugins
const $formatDate: any = inject('$formatDate');
const $deepCopy: any = inject('$deepCopy');
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
const products = ref<GenericObject[]>([]);
const editedItem = ref<GenericObject>(Product());
const defaultItem = ref<GenericObject>(Product());
// Pagination
const pagination = ref<GenericObject>({});
const page = ref<number>(1);
const pageCount = ref<number>(0);
// Search
const fieldsToSearch = ref<string[]>(['name', 'categories', 'description']);
const search = ref<string>('');
// Others
const loadingButton = ref<boolean>(false);
const delayTimer = ref<any>(null);
const editedIndex = ref<number>(-1);
const showMoreDescription = ref<GenericObject>({})
const dialog = ref<boolean>(false);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Crear Product' : 'Editar Product';
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
  await Promise.all([$store.dispatch('productsModule/list', payload)]);
  products.value = $deepCopy($store.state.productsModule.products);
}

async function save() {
  loadingButton.value = true;
  if (editedIndex.value > -1) {
    let id = products.value[editedIndex.value]._id;
    try {
      await $store.dispatch('productsModule/update', {
        id,
        data: editedItem.value,
      });
      Object.assign(products.value[editedIndex.value], editedItem.value);
      close();
    } finally {
      loadingButton.value = false;
    }
  } else {
    //create item
    try {
      let newItem = await $store.dispatch(
        'productsModule/create',
        editedItem.value,
      );
      products.value.push(newItem);
      close();
      initialize();
    } finally {
      loadingButton.value = false;
    }
  }
}

function editItem(item: GenericObject) {
  editedIndex.value = products.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

async function deleteItem(item: GenericObject) {
  const index = products.value.indexOf(item);
  let id = products.value[index]._id;
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
    await $store.dispatch('productsModule/delete', id);
    products.value.splice(index, 1);
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
