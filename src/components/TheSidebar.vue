<template>
  <!-- Sidemenu Area -->
  <div class="ecaps-sidemenu-area">
    <!-- Desktop Logo -->
    <div class="ecaps-logo">
      <a href="/"><img class="desktop-logo" src="https://ia.databot.cl/img/brand/0-default.svg" alt="Desktop Logo" />
        <img class="small-logo" src="https://ia.databot.cl/img/brand/0-default.svg" alt="Mobile Logo" /></a>
    </div>

    <!-- Side Nav -->
    <div class="ecaps-sidenav" id="ecapsSideNav">
      <!-- Side Menu Area -->
      <div class="side-menu-area">
        <!-- Sidebar Menu -->
        <nav>
          <ul class="sidebar-menu" data-widget="tree">
            <li>
              <router-link to="/assistants" class="nav-link" active-class="active">
                <i class="bx bx-home-heart"></i><span>Asistentes</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/statistics?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="bx bx-list-ul"></i><span>Estadísticas</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/intents?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="bx bx-list-ul"></i><span>Intenciones</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/entities?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="bx bx-list-ul"></i><span>Entidades</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/dialog?assistant_id=${assistant_id}`" class="nav-link" active-class="active">
                <i class="bx bx-list-ul"></i><span>Diálogo</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/documents?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="bx bx-list-ul"></i><span>Documentos</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/products?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="bx bxs-cart"></i><span>Productos</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/playground?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="fa fa-flask"></i><span>Playground</span>
              </router-link>
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

<style scoped>
.nav-link.active {
  background-color: #5E00D9;
  color: #ffffff;
}
</style>
