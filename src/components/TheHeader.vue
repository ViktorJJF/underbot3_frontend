<template>
  <header class="top-header-area d-flex align-items-center justify-content-between">
    <div class="left-side-content-area d-flex align-items-center">
      <!-- Mobile Logo -->
      <div class="mobile-logo mr-3 mr-sm-4">
      </div>

      <!-- Triggers -->
      <div class="ecaps-triggers mr-1 mr-sm-3">
        <div class="menu-collasped" id="menuCollasped">
          <i class="bx bx-menu"></i>
        </div>
        <div class="mobile-menu-open" id="mobileMenuOpen">
          <i class="bx bx-menu"></i>
        </div>
      </div>
    </div>

    <div class="right-side-navbar d-flex align-items-center justify-content-end">
      <!-- Mobile Trigger -->
      <div class="right-side-trigger" id="rightSideTrigger">
        <i class="bx bx-menu-alt-right"></i>
      </div>

      <!-- Top Bar Nav -->
      <ul class="right-side-content d-flex align-items-center">

        <li class="nav-item dropdown">
          <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false"><i class="bx bx-bell bx-tada"></i> <span class="active-status"></span></button>
        </li>

        <li class="nav-item dropdown show">
          <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="true"><img src="/images/bot-profile.png" alt=""></button>
          <div class="dropdown-menu profile dropdown-menu-right show" x-placement="bottom-end"
            style="position: absolute; transform: translate3d(-152px, 36px, 0px); top: 0px; left: 0px; will-change: transform;">
            <!-- User Profile Area -->
            <div class="user-profile-area">
              <span>{{ $store.state.authModule.user?.email }}</span>
              <div class="horizontal-line"></div>
              <a href="#" class="dropdown-item"><i class="bx bx-user font-15" aria-hidden="true"></i> Mi perfil</a>
              <a @click="$store.dispatch('authModule/logout')" class="dropdown-item"><i class="bx bx-power-off font-15"
                  aria-hidden="true"></i> Cerrar
                Sesion</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
const $store = useStore()
console.log($store.state.authModule);
</script>



<style lang="scss" scoped>
.horizontal-line {
  width: 100%;
  height: 0.5px;
  background-color: grey;
}
</style>
