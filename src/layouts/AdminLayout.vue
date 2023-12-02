<template>
  <TheHeader></TheHeader>
  <main class="d-flex flex-nowrap">
    <TheSidebar class="jf-sidebar"></TheSidebar>
    <div class="custom-content-view">
      <router-view></router-view>
    </div>
  </main>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue';
import TheSidebar from '@/components/TheSidebar.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>

<style lang="scss" scoped>
.custom-content-view {
  flex-grow: 1; /* Hace que el contenido ocupe todo el espacio disponible */
  padding: 20px; /* Espaciado interno para el contenido */
  overflow-y: auto; /* Agrega desplazamiento vertical si el contenido es muy largo */
  background-color: #f8f9fa; /* Color de fondo para la vista de contenido */
}
</style>
