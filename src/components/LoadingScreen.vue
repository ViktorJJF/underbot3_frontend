<template>
    <div v-if="$store.state.loadingModule.loading" id="preloader">
        <div class="preload-content">
            <div id="hasro-load"></div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useStore } from 'vuex'

const $store = useStore()

</script>

<style lang="scss" scoped></style>