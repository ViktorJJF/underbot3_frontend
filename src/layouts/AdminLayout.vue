<template>
  <TheHeader></TheHeader>
  <main class="main-layout">
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
.main-layout {
  display: flex;
  flex-wrap: nowrap;
  min-height: 100vh;
  align-items: stretch;
}

.custom-content-view {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f8f9fa;
}

/* Mobile styles */
@media (max-width: 767.98px) {
  .main-layout {
    display: block;
  }

  .custom-content-view {
    width: 100%;
    min-height: 100vh;
    padding: 60px 12px 12px 12px;
  }
}

/* Desktop styles */
@media (min-width: 768px) {
  .custom-content-view {
    padding: 20px;
    width: calc(100vw - 280px);
  }
}
</style>
