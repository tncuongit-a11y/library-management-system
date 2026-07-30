<template>
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1090;">
        <transition-group name="toast-fade">
            <div 
                v-for="toast in toastStore.toasts" 
                :key="toast.id" 
                class="toast show shadow-lg border-0 mb-2 rounded-3 text-white overflow-hidden"
                :class="getToastBgClass(toast.type)"
                role="alert" 
                aria-live="assertive" 
                aria-atomic="true"
            >
                <div class="d-flex align-items-center p-3">
                    <div class="me-3 fs-5 d-flex align-items-center">
                        <CheckCircle2 v-if="toast.type === 'success'" :size="22" />
                        <AlertCircle v-else-if="toast.type === 'error'" :size="22" />
                        <AlertTriangle v-else-if="toast.type === 'warning'" :size="22" />
                        <Info v-else :size="22" />
                    </div>
                    <div class="flex-grow-1 me-2">
                        <div v-if="toast.title" class="fw-semibold text-capitalize small opacity-90 mb-0.5">{{ toast.title }}</div>
                        <div class="small fw-medium">{{ toast.message }}</div>
                    </div>
                    <button 
                        type="button" 
                        class="btn-close btn-close-white ms-auto" 
                        @click="toastStore.removeToast(toast.id)"
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast.store';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next';

const toastStore = useToastStore();

const getToastBgClass = (type) => {
    switch (type) {
        case 'success':
            return 'bg-emerald-600 text-white';
        case 'error':
            return 'bg-rose-600 text-white';
        case 'warning':
            return 'bg-amber-600 text-white';
        case 'info':
            return 'bg-blue-600 text-white';
        default:
            return 'bg-slate-800 text-white';
    }
};
</script>

<style scoped>
.toast-container {
    max-width: 380px;
    width: 100%;
}

.toast {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}

.bg-emerald-600 { background-color: #059669 !important; }
.bg-rose-600 { background-color: #e11d48 !important; }
.bg-amber-600 { background-color: #d97706 !important; }
.bg-blue-600 { background-color: #2563eb !important; }
.bg-slate-800 { background-color: #1e293b !important; }

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
}

.toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
}
</style>
