<template>
    <div class="text-center py-5 px-4 my-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div class="mx-auto mb-3 text-slate-400 p-3 bg-white rounded-circle shadow-xs border border-slate-100 d-inline-flex align-items-center justify-content-center" style="width: 56px; height: 56px;">
            <Inbox v-if="icon === 'inbox'" :size="28" />
            <Search v-else-if="icon === 'search'" :size="28" />
            <BookX v-else-if="icon === 'book'" :size="28" />
            <Users v-else-if="icon === 'users'" :size="28" />
            <FolderOpen v-else :size="28" />
        </div>
        <h6 class="fw-bold text-slate-800 mb-1 fs-6">{{ title || 'Không tìm thấy dữ liệu' }}</h6>
        <p class="text-slate-500 fs-7 mb-3 max-w-sm mx-auto">{{ message || 'Chưa có thông tin phù hợp với điều kiện tìm kiếm hiện tại.' }}</p>
        <button v-if="actionText" type="button" class="btn btn-primary btn-sm rounded-lg px-3 py-1.5 fw-medium d-inline-flex align-items-center gap-1.5" @click="$emit('action')">
            <Plus :size="16" />
            <span>{{ actionText }}</span>
        </button>
    </div>
</template>

<script setup>
import { Inbox, Search, BookX, Users, FolderOpen, Plus } from 'lucide-vue-next';

defineProps({
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    icon: { type: String, default: 'inbox' },
    actionText: { type: String, default: '' }
});

defineEmits(['action']);
</script>
