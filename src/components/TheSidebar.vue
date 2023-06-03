<template>
  <!-- Sidemenu Area -->
  <div class="ecaps-sidemenu-area">
    <!-- Desktop Logo -->
    <div class="ecaps-logo">
      <a href="/"><img class="desktop-logo" src="img/core-img/logo.png" alt="Desktop Logo" />
        <img class="small-logo" src="img/core-img/small-logo.png" alt="Mobile Logo" /></a>
    </div>

    <!-- Side Nav -->
    <div class="ecaps-sidenav" id="ecapsSideNav">
      <!-- Side Menu Area -->
      <div class="side-menu-area">
        <!-- Sidebar Menu -->
        <nav>
          <ul class="sidebar-menu" data-widget="tree">
            <li>
              <a href="/assistants"><i class="bx bx-home-heart"></i><span>Asistentes</span></a>
            </li>
            <li v-if="assistant_id">
              <a :href="`/assistants/documents?assistant_id=${assistant_id}`"><i
                  class="bx bx-home-heart"></i><span>Documentos</span></a>
            </li>
            <li v-if="assistant_id">
              <a :href="`/assistants/products?assistant_id=${assistant_id}`"><i
                  class="bx bx-home-heart"></i><span>Productos</span></a>
            </li>
            <li v-if="assistant_id">
              <a :href="`/assistants/entities?assistant_id=${assistant_id}`"><i
                  class="bx bx-home-heart"></i><span>Entidades</span></a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();

const assistant_id = computed<string>(() => {
  return $route.query.assistant_id as string;
});

</script>

<style scoped></style>
