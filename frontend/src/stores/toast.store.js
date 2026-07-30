import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
    const toasts = ref([]);

    const addToast = ({ title = '', message, type = 'success', duration = 4000 }) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 5);
        toasts.value.push({ id, title, message, type });

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    };

    const success = (message, title = 'Thành công') => addToast({ title, message, type: 'success' });
    const error = (message, title = 'Đã xảy ra lỗi') => addToast({ title, message, type: 'error' });
    const warning = (message, title = 'Cảnh báo') => addToast({ title, message, type: 'warning' });
    const info = (message, title = 'Thông báo') => addToast({ title, message, type: 'info' });

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    };
});
