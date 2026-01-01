<template>
  <div class="sidebar-wrapper">
    <!-- Mobile toggle button -->
    <button
      class="sidebar-toggle d-md-none"
      @click="toggleSidebar"
      :class="{ 'is-open': isSidebarOpen }"
    >
      <span class="toggle-icon"></span>
    </button>

    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay d-md-none"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div
      v-if="isSidebarVisible"
      class="sidebar-container d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      :class="{ 'is-open': isSidebarOpen }"
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
            @click="closeSidebar"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

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
const isSidebarOpen = ref(false);

const $route = useRoute();

function toggleSidebar(): void {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function closeSidebar(): void {
  isSidebarOpen.value = false;
}
</script>

<style scoped>
/* Base styles for desktop (default) */
.sidebar-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 280px;
  align-self: stretch;
}

.sidebar-container {
  width: 280px;
  min-height: 100vh;
  height: 100%;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.sidebar-toggle {
  display: none;
}

/* Mobile styles */
@media (max-width: 767.98px) {
  .sidebar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1060;
    width: 0;
    height: 0;
    align-self: auto;
  }

  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    min-height: unset;
    z-index: 1050;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
  }

  .sidebar-container.is-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
  }

  .sidebar-toggle {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1060;
    width: 44px;
    height: 44px;
    padding: 8px;
    background-color: #212529;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sidebar-toggle .toggle-icon,
  .sidebar-toggle .toggle-icon::before,
  .sidebar-toggle .toggle-icon::after {
    display: block;
    width: 24px;
    height: 3px;
    background-color: #fff;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
  }

  .sidebar-toggle .toggle-icon {
    position: relative;
  }

  .sidebar-toggle .toggle-icon::before,
  .sidebar-toggle .toggle-icon::after {
    content: '';
    position: absolute;
    left: 0;
  }

  .sidebar-toggle .toggle-icon::before {
    top: -8px;
  }

  .sidebar-toggle .toggle-icon::after {
    top: 8px;
  }

  /* Hamburger to X animation */
  .sidebar-toggle.is-open .toggle-icon {
    background-color: transparent;
  }

  .sidebar-toggle.is-open .toggle-icon::before {
    transform: rotate(45deg);
    top: 0;
  }

  .sidebar-toggle.is-open .toggle-icon::after {
    transform: rotate(-45deg);
    top: 0;
  }
}

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
</style>
