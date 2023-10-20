<template>
  <!-- Sidemenu Area -->
  <div class="ecaps-sidemenu-area">
    <!-- Desktop Logo -->
    <div class="ecaps-logo">
      <a href="/"
        ><img
          class="desktop-logo"
          src="https://ia.databot.cl/img/brand/0-default.svg"
          alt="Desktop Logo" />
        <img
          class="small-logo"
          src="https://ia.databot.cl/img/brand/0-default.svg"
          alt="Mobile Logo"
      /></a>
    </div>

    <!-- Side Nav -->
    <div id="ecapsSideNav" class="ecaps-sidenav">
      <!-- Side Menu Area -->
      <div class="side-menu-area">
        <!-- Sidebar Menu -->
        <nav>
          <ul class="sidebar-menu" data-widget="tree">
            <li>
              <router-link
                :to="{ name: 'Cities' }"
                class="nav-link"
                active-class="active"
              >
                <i class="bx bx-home-heart"></i><span>Ciudades</span>
              </router-link>
            </li>
            <div class="horizontal-line"></div>
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

const cryptoMenuVisible = ref(true);
const cryptoMenuStyle = ref('display: block;');

const toggleCryptoMenu = () => {
  cryptoMenuVisible.value = !cryptoMenuVisible.value;
  cryptoMenuStyle.value = cryptoMenuVisible.value
    ? 'display: block;'
    : 'display: none;';
};
</script>

<style scoped>
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
