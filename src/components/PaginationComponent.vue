<template>
  <div class="custom-pagination">
    <div class="pagination-info" v-if="showTotal">
      <span class="text-muted">
        Página {{ currentPage }} {{ totalPages > 0 ? `de ${totalPages}` : '' }}
        <span v-if="total > 0">({{ startItem }}-{{ endItem }} de {{ total }} resultados)</span>
      </span>
    </div>
    
    <div class="pagination-controls">
      <button 
        class="pagination-btn prev-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <span>&laquo;</span>
        Anterior
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage, ellipsis: page === '...' }"
          :disabled="page === '...'"
          @click="handlePageClick(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-btn next-btn"
        @click="goToPage(currentPage + 1)"
      >
        Siguiente
        <span>&raquo;</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  pageSize: {
    type: Number,
    required: true,
    default: 15,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  showTotal: {
    type: Boolean,
    default: true,
  },
  hasNextPage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['page-change']);

const totalPages = computed(() => {
  if (props.total > 0) {
    return Math.ceil(props.total / props.pageSize);
  }
  // If we don't know the total, return 0 to indicate unknown
  return 0;
});

const startItem = computed(() => {
  if (props.total === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
  if (props.total <= 0) return props.currentPage * props.pageSize;
  const end = props.currentPage * props.pageSize;
  return end > props.total ? props.total : end;
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const current = props.currentPage;
  
  // If total is unknown or 0, just show current and next if available
  if (props.total <= 0) {
    if (current > 1) pages.push(current - 1);
    pages.push(current);
    if (props.hasNextPage) pages.push(current + 1);
    return pages;
  }
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

function goToPage(page: number) {
  console.log('Pagination: goToPage', page);
  if (page >= 1 && page !== props.currentPage) {
    emit('page-change', page);
  }
}

function handlePageClick(page: number | string) {
  console.log('Pagination: handlePageClick', page);
  if (page !== '...') {
    goToPage(page as number);
  }
}
</script>

<style scoped>
.custom-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px 0;
}

.pagination-info {
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  background: white;
  color: #606266;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  color: #409eff;
  border-color: #409eff;
}

.pagination-btn:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background-color: #f5f7fa;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #dcdfe6;
  background: white;
  color: #606266;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled):not(.ellipsis) {
  color: #409eff;
  border-color: #409eff;
}

.page-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.page-btn.ellipsis {
  border: none;
  background: none;
  cursor: default;
  color: #606266;
}

/* Mobile styles */
@media (max-width: 768px) {
  .pagination-controls {
    gap: 5px;
  }
  
  .pagination-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .page-btn {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
  }
  
  .pagination-info {
    font-size: 13px;
  }
}
</style>
