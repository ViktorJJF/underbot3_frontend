<template><div></div></template>

<script lang="ts" setup>
import { useStore } from 'vuex';
const $store = useStore();
console.log($store.state.authModule);
</script>

<style lang="scss" scoped></style>
