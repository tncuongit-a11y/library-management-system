<template>
    <div v-if="totalPages > 1" class="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 pt-3 border-top border-slate-100">
        <div class="text-slate-500 fs-7">
            Trang <span class="fw-semibold text-slate-800">{{ currentPage }}</span> / <span class="fw-semibold text-slate-800">{{ totalPages }}</span>
        </div>

        <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm mb-0 gap-1 align-items-center">
                <!-- First Page -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link rounded-lg p-2 d-flex align-items-center justify-content-center text-slate-600 border-slate-200 shadow-xs" @click="changePage(1)" title="Trang đầu">
                        <ChevronsLeft :size="16" />
                    </button>
                </li>

                <!-- Prev Page -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link rounded-lg p-2 d-flex align-items-center justify-content-center text-slate-600 border-slate-200 shadow-xs" @click="changePage(currentPage - 1)" title="Trang trước">
                        <ChevronLeft :size="16" />
                    </button>
                </li>

                <!-- Visible Page Numbers -->
                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                    <button 
                        class="page-link rounded-lg px-3 py-1.5 fw-medium border-slate-200 shadow-xs" 
                        :class="currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'text-slate-700 bg-white hover:bg-slate-50'"
                        @click="changePage(page)"
                    >
                        {{ page }}
                    </button>
                </li>

                <!-- Next Page -->
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link rounded-lg p-2 d-flex align-items-center justify-content-center text-slate-600 border-slate-200 shadow-xs" @click="changePage(currentPage + 1)" title="Trang sau">
                        <ChevronRight :size="16" />
                    </button>
                </li>

                <!-- Last Page -->
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link rounded-lg p-2 d-flex align-items-center justify-content-center text-slate-600 border-slate-200 shadow-xs" @click="changePage(totalPages)" title="Trang cuối">
                        <ChevronsRight :size="16" />
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

const props = defineProps({
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true }
});

const emit = defineEmits(['update:currentPage']);

const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(props.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const changePage = (page) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('update:currentPage', page);
    }
};
</script>

<style scoped>
.page-link {
    color: #475569;
    border-color: #e2e8f0;
    transition: all 0.15s ease-in-out;
}
.page-link:hover:not(.disabled) {
    background-color: #f8fafc;
    color: #0f172a;
}
.page-item.active .page-link {
    background-color: #4f46e5 !important;
    border-color: #4f46e5 !important;
    color: white !important;
}
.page-item.disabled .page-link {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: #f8fafc;
}
.bg-indigo-600 { background-color: #4f46e5; }
.border-indigo-600 { border-color: #4f46e5; }
</style>
