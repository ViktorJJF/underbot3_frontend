<template>
    <div class="row">
        <div class="col-12">
            <div class="card box-margin">
                <div class="card-body">
                    <h3>Editar documento</h3>
                    <el-form label-position="top" label-width="100px">
                        <el-form-item label="Título">
                            <el-input v-model="editedItem.title" />
                        </el-form-item>
                        <el-form-item label="Tipo">
                            <el-input v-model="editedItem.type" />
                        </el-form-item>
                        <el-form-item label="Contenido">
                            <el-input type="textarea" autosize v-model="editedItem.content" />
                        </el-form-item>
                        <el-button type="success" @click="save" :loading="loadingButton">
                            Guardar
                        </el-button>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import type { GenericObject } from '@/types/GenericObject';
import Document from '@/models/Documents';

// plugins
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
// Entity
let editedItem = ref<GenericObject>(Document());

// Others
let loadingButton = ref<boolean>(false);
let delayTimer: any = null;
let editedIndex = ref<number>(-1);

let dialog = ref<boolean>(false);

const documentId = computed(() => {
    return $route.params.document_id;
})

onMounted(() => {
    initialize();
});

async function initialize(): Promise<any> {
    editedItem.value = await $store.dispatch('documentsModule/listOne', documentId.value);
}

async function save() {
    loadingButton.value = true;
    try {
        await $store.dispatch('documentsModule/update', {
            id: documentId.value,
            data: editedItem.value,
        });
        close();
    } finally {
        loadingButton.value = false;
    }
}

</script>
  
<style lang="scss" scoped></style>
  