<template>
  <!-- Preloader End -->
  <div class="ecaps-page-wrapper">
    <TheSidebar></TheSidebar>

    <!-- Page Content -->
    <div class="ecaps-page-content">
      <TheHeader></TheHeader>

      <!-- Main Content Area -->
      <div class="main-content">
        <div class="container-fluid"><router-view></router-view></div>

        <TheFooter></TheFooter>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue';
import TheSidebar from '@/components/TheSidebar.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>

<style lang="scss" scoped></style>
