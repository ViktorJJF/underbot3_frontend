<template>
    <div class="row">
        <div class="col-12">
            <div class="card box-margin">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-6"><el-form label-position="top" label-width="100px" style="max-width: 460px">
                                <el-form-item label="Text splitter">
                                    <div class="row">
                                        <div class="col-sm-6"><el-input :disabled="useLangchainSplitter"
                                                v-model="text_splitter" />
                                        </div>
                                        <div class="col-sm-6"><el-checkbox v-model="useLangchainSplitter"
                                                label="Langchain Splitter" name="type" /></div>
                                    </div>
                                </el-form-item>
                            </el-form>
                            <el-button type="primary" class="mb-3"
                                @click="vectorizeCustomText(textToVectorize, text_splitter)"
                                :loading="loadingButton">Vectorizar</el-button>

                        </div>
                        <div class="col-sm-6">
                            <el-form label-position="top" label-width="100px" style="max-width: 460px">
                                <el-form-item label="Query">
                                    <el-input class="mb-2" v-model="message" placeholder="Búsqueda para recomendación"
                                        clearable
                                        @keyup.enter="testSemanticSearch(message, retriever_type, max_documents)" />
                                </el-form-item>
                                <el-form-item label="Cantidad docs">
                                    <el-input type="number" v-model="max_documents" />
                                </el-form-item>
                                <el-button type="primary" color="#5E00D9" class="mb-3 mr-3"
                                    @click="testSemanticSearch(message, retriever_type, max_documents)"
                                    :loading="loadingButton">Probar</el-button>
                                <span v-if="documents" class="mb-2">{{ documents.length }} documentos retornados</span>
                            </el-form>
                        </div>
                    </div>
                    <div class="horizontal-line mb-3"></div>
                    <div class="row">
                        <div class="col-sm-6">
                            <el-input type="textarea" :autosize="{ minRows: 15 }" v-model="textToVectorize"
                                placeholder="Texto para vectorizar aquí" />
                        </div>
                        <div class="col-sm-6">
                            <el-card shadow="never" v-for="(el, idx) in documents" :key="idx">
                                <template #header>
                                    <span># {{ idx + 1 }} Score: {{ el.score }}</span>
                                </template>
                                <div style="white-space: pre-line">{{ el.content }}</div>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router';

const $store = useStore();
const $route = useRoute();

const message = ref<string>('')
const retriever_type = ref<string>('custom')
const max_documents = ref<number>(5)
const documents = ref<any[]>([])
const loadingButton = ref<boolean>(false)
// for custom text to vectorize
const text_splitter = ref<string>('\\n\\n')
const useLangchainSplitter = ref<boolean>(false)
const textToVectorize = ref<string>('')

const assistant_id = computed<string>(() => {
    return $route.query.assistant_id as string;
});

async function testSemanticSearch(message: string, retriever_type: string, max_documents: number) {
    try {
        loadingButton.value = true
        documents.value = await $store.dispatch('assistantsModule/testSemanticSearch', { assistant_id: assistant_id.value, message, retriever_type, max_documents })
    } catch (error) {
        console.log(error);
    } finally {
        loadingButton.value = false
    }

}

async function vectorizeCustomText(text: string, text_splitter: string) {
    try {
        loadingButton.value = true
        documents.value = await $store.dispatch('assistantsModule/vectorizeCustomText', { assistant_id: assistant_id.value, text, text_splitter: useLangchainSplitter.value ? 'langchain' : text_splitter })
    } catch (error) {
        console.log(error);
    } finally {
        loadingButton.value = false
    }
}

</script>

<style scoped></style>