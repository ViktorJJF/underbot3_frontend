<template>
  <div v-if="isSidebarVisible" class="d-flex flex-nowrap">
    <h1 class="visually-hidden">Sidebars examples</h1>
    <div
      class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style="width: 280px"
    >
      <a
        href="/"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg class="bi pe-none me-2" width="40" height="32">
          <use xlink:href="#bootstrap"></use>
        </svg>
        <span class="fs-4">Underbot 3</span>
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li v-for="(view, idx) in views" :key="idx" class="nav-item">
          <router-link
            :to="{ name: view.name }"
            class="nav-link"
            :class="{ active: $route.name === view.name }"
            aria-current="page"
            ><svg class="bi pe-none me-2" width="16" height="16">
              <use xlink:href="#home"></use>
            </svg>
            {{ view.label }}</router-link
          >
        </li>
      </ul>
      <hr />
      <div class="dropdown">
        <a
          href="#"
          class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            class="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
          <li><a class="dropdown-item" href="#">New project...</a></li>
          <li><a class="dropdown-item" href="#">Settings</a></li>
          <li><a class="dropdown-item" href="#">Profile</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li><a class="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </div>
    <div class="b-example-divider b-example-vr"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $router = useRouter();

const views = ref<any[]>([
  {
    name: 'MatchesView',
    icon: 'home',
    label: 'Matches',
  },
  {
    name: 'TeamsView',
    icon: 'home',
    label: 'Teams',
  },
  {
    name: 'SimulationView',
    icon: 'home',
    label: 'Simulador',
  },
  {
    name: 'SimulationView2',
    icon: 'home',
    label: 'Simulador 2',
  },
]);

const isSidebarVisible = ref(true);

const $route = useRoute();
</script>

<style scoped>
.nav-link {
  color: #ffffff;
}
.nav-link.active {
  background-color: #5e00d9;
  color: #ffffff;
}

.horizontal-line {
  width: 100%;
  height: 0.5px;
  background-color: grey;
}

.content-view {
  flex-grow: 1; /* Hace que el contenido ocupe todo el espacio disponible */
  padding: 20px; /* Espaciado interno para el contenido */
  overflow-y: auto; /* Agrega desplazamiento vertical si el contenido es muy largo */
  background-color: #f8f9fa; /* Color de fondo para la vista de contenido */
}

@media (min-width: 768px) {
  .sidebar {
    /* Show the sidebar on screens wider than 768px */
    display: block;
  }
}
</style>
