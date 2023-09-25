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
            <div class="horizontal-line"></div>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/statistics?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="bx bx-list-ul"></i><span>Estadísticas</span>
              </router-link>
            </li>
            <li v-if="assistant_id">
              <router-link :to="`/assistants/conversations?assistant_id=${assistant_id}`" class="nav-link"
                active-class="active">
                <i class="bx bx-list-ul"></i><span>Conversaciones usuarios</span>
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
            <li v-if="assistant_id" class="treeview menu-open" @click.self="toggleCryptoMenu">
              <a href="javascript:void(0)">
                <i class="fa fa-flask"></i><span>Playground</span>
                <i class="fa fa-angle-right"></i>
              </a>
              <ul class="treeview-menu" :style="cryptoMenuStyle">
                <router-link :to="`/assistants/playground?assistant_id=${assistant_id}`" class="nav-link"
                  active-class="active">
                  <i class="fa fa-flask"></i><span>Bot</span>
                </router-link>
                <router-link :to="`/assistants/playground/recommender?assistant_id=${assistant_id}`" class="nav-link"
                  active-class="active">
                  <i class="fa fa-flask"></i><span>Recomendador</span>
                </router-link>
                <router-link :to="`/assistants/playground/semantic_search?assistant_id=${assistant_id}`" class="nav-link"
                  active-class="active">
                  <i class="fa fa-flask"></i><span>Semantic Search</span>
                </router-link>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();

const assistant_id = computed<string>(() => {
  return $route.query.assistant_id as string;
});

const cryptoMenuVisible = ref(true);
const cryptoMenuStyle = ref('display: block;');

const toggleCryptoMenu = () => {
  cryptoMenuVisible.value = !cryptoMenuVisible.value;
  cryptoMenuStyle.value = cryptoMenuVisible.value ? 'display: block;' : 'display: none;';
};

</script>

<style scoped>
.nav-link.active {
  background-color: #5E00D9;
  color: #ffffff;
}

.horizontal-line {
  width: 100%;
  height: 0.5px;
  background-color: grey;
}
</style>
