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
      <!-- Top Bar Nav -->
      <ul class="right-side-content d-flex align-items-center">
        <li class="nav-item dropdown">
          <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">
          </button>
          <div class="dropdown-menu profile dropdown-menu-right">
            <!-- User Profile Area -->
            <div class="user-profile-area">
              <a href="#" class="dropdown-item"><i class="bx bx-user font-15" aria-hidden="true"></i> My
                profile</a>
              <a href="#" class="dropdown-item"><i class="bx bx-wallet font-15" aria-hidden="true"></i> My
                wallet</a>
              <a href="#" class="dropdown-item"><i class="bx bx-wrench font-15" aria-hidden="true"></i>
                settings</a>
              <a href="#" class="dropdown-item"><i class="bx bx-power-off font-15" aria-hidden="true"></i>
                Sign-out</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
