<template>
    <transition name="modal-fade">
        <div v-if="isOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3" @click.self="handleCancel">
            <div class="modal-card bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-100 max-w-md animate-scale">
                <div class="p-5 text-center">
                    <div class="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center bg-rose-50 text-rose-600 border border-rose-100" style="width: 56px; height: 56px;">
                        <AlertTriangle :size="28" />
                    </div>
                    
                    <h5 class="fw-bold text-slate-900 mb-2">{{ title || 'Xác nhận hành động' }}</h5>
                    <p class="text-slate-600 mb-4 fs-6 leading-relaxed">{{ message }}</p>

                    <div class="d-flex align-items-center justify-content-end gap-2 pt-2">
                        <button 
                            type="button" 
                            class="btn btn-slate-light px-4 py-2 rounded-lg fw-medium text-slate-700 hover:bg-slate-100 transition-colors" 
                            @click="handleCancel"
                            :disabled="isLoading"
                        >
                            {{ cancelText || 'Hủy bỏ' }}
                        </button>
                        <button 
                            type="button" 
                            class="btn btn-rose px-4 py-2 rounded-lg fw-medium text-white shadow-sm hover:bg-rose-700 transition-all d-flex align-items-center gap-2" 
                            @click="handleConfirm"
                            :disabled="isLoading"
                        >
                            <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                            <span>{{ confirmText || 'Xác nhận xóa' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next';

defineProps({
    isOpen: { type: Boolean, default: false },
    title: { type: String, default: '' },
    message: { type: String, required: true },
    confirmText: { type: String, default: 'Xác nhận' },
    cancelText: { type: String, default: 'Hủy bỏ' },
    isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => emit('confirm');
const handleCancel = () => emit('cancel');
</script>

<style scoped>
.modal-backdrop-custom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    z-index: 1080;
}

.modal-card {
    max-width: 440px;
}

.bg-rose-50 { background-color: #fff1f2; }
.text-rose-600 { color: #e11d48; }
.border-rose-100 { border-color: #ffe4e6; }
.btn-rose { background-color: #e11d48; border-color: #e11d48; color: white; }
.btn-rose:hover { background-color: #be123c; }

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.animate-scale {
    animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
