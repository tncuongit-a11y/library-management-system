<template>
    <div v-if="isOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3 z-3">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-100 max-w-md overflow-hidden animate-pop">
            <!-- Header Tabs -->
            <div class="d-flex border-bottom border-slate-100 bg-slate-50">
                <button 
                    type="button" 
                    class="flex-1 py-3.5 fs-7 fw-bold transition-all border-bottom-2"
                    :class="activeTab === 'login' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-500 border-transparent hover:text-slate-900'"
                    @click="activeTab = 'login'"
                >
                    Đăng Nhập Độc Giả
                </button>
                <button 
                    type="button" 
                    class="flex-1 py-3.5 fs-7 fw-bold transition-all border-bottom-2"
                    :class="activeTab === 'register' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-500 border-transparent hover:text-slate-900'"
                    @click="activeTab = 'register'"
                >
                    Đăng Ký Tài Khoản
                </button>
                <button 
                    type="button" 
                    class="p-3 text-slate-400 hover:text-slate-700"
                    @click="$emit('close')"
                >
                    <X :size="20" />
                </button>
            </div>

            <!-- Modal Content Body -->
            <div class="p-4 p-sm-5">
                <!-- Alert Error -->
                <div v-if="authStore.error" class="alert alert-rose bg-rose-50 text-rose-700 border border-rose-200 rounded-xl p-3 mb-4 fs-8 d-flex align-items-center gap-2">
                    <AlertCircle :size="18" class="text-rose-600 flex-shrink-0" />
                    <span>{{ authStore.error }}</span>
                </div>

                <!-- LOGIN FORM -->
                <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label class="form-label text-slate-700 fw-semibold fs-8">Số điện thoại hoặc Mã độc giả</label>
                        <div class="position-relative">
                            <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                <User :size="18" />
                            </span>
                            <input 
                                v-model="loginForm.account" 
                                type="text" 
                                class="form-control ps-5 py-2.5 rounded-xl fs-7" 
                                placeholder="Nhập SĐT (090...) hoặc Mã ĐG (DG001)..." 
                                required 
                            />
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-slate-700 fw-semibold fs-8">Mật khẩu</label>
                        <div class="position-relative">
                            <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                <Lock :size="18" />
                            </span>
                            <input 
                                v-model="loginForm.password" 
                                type="password" 
                                class="form-control ps-5 py-2.5 rounded-xl fs-7" 
                                placeholder="Nhập mật khẩu..." 
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        class="btn btn-indigo w-100 py-2.5 rounded-xl fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-xs"
                        :disabled="authStore.isLoading"
                    >
                        <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm"></span>
                        <template v-else>
                            <LogIn :size="18" />
                            <span>Đăng Nhập Độc Giả</span>
                        </template>
                    </button>
                </form>

                <!-- REGISTER FORM -->
                <form v-else @submit.prevent="handleRegister">
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <label class="form-label text-slate-700 fw-semibold fs-8">Họ & Tên lót *</label>
                            <input v-model="registerForm.hoLot" type="text" class="form-control rounded-xl fs-7" placeholder="Nguyễn Văn" required />
                        </div>
                        <div class="col-6">
                            <label class="form-label text-slate-700 fw-semibold fs-8">Tên *</label>
                            <input v-model="registerForm.ten" type="text" class="form-control rounded-xl fs-7" placeholder="An" required />
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-slate-700 fw-semibold fs-8">Số điện thoại *</label>
                        <div class="position-relative">
                            <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                <Phone :size="16" />
                            </span>
                            <input v-model="registerForm.dienThoai" type="tel" class="form-control ps-5 rounded-xl fs-7" placeholder="0981234567" required />
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-slate-700 fw-semibold fs-8">Địa chỉ *</label>
                        <input v-model="registerForm.diaChi" type="text" class="form-control rounded-xl fs-7" placeholder="Số nhà, đường, quận/huyện..." required />
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-slate-700 fw-semibold fs-8">Mật khẩu khởi tạo *</label>
                        <div class="position-relative">
                            <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                <Lock :size="16" />
                            </span>
                            <input v-model="registerForm.matKhau" type="password" class="form-control ps-5 rounded-xl fs-7" placeholder="Tối thiểu 6 ký tự..." required minlength="6" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        class="btn btn-indigo w-100 py-2.5 rounded-xl fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-xs"
                        :disabled="authStore.isLoading"
                    >
                        <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm"></span>
                        <template v-else>
                            <UserPlus :size="18" />
                            <span>Tạo Tài Khoản Mới</span>
                        </template>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useToastStore } from '../stores/toast.store';
import { X, User, Lock, Phone, LogIn, UserPlus, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    initialTab: { type: String, default: 'login' }
});

const emit = defineEmits(['close', 'success']);

const authStore = useAuthStore();
const toast = useToastStore();
const router = useRouter();

const activeTab = ref('login');
const loginForm = ref({ account: '', password: '' });
const registerForm = ref({
    hoLot: '',
    ten: '',
    dienThoai: '',
    diaChi: '',
    matKhau: ''
});

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        activeTab.value = props.initialTab || 'login';
        authStore.error = null;
    }
});

const handleLogin = async () => {
    const success = await authStore.readerLogin(loginForm.value.account, loginForm.value.password);
    if (success) {
        toast.success(`Xin chào, ${authStore.user.hoTen || 'Độc giả'}!`);
        emit('success');
        emit('close');
        router.push({ name: 'ReaderPortal' });
    }
};

const handleRegister = async () => {
    const success = await authStore.readerRegister(registerForm.value);
    if (success) {
        toast.success('Đăng ký tài khoản thành công!');
        emit('success');
        emit('close');
        router.push({ name: 'ReaderPortal' });
    }
};
</script>

<style scoped>
.modal-backdrop-custom {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
}
.max-w-md { max-width: 440px; }
.btn-indigo { background-color: #4f46e5; color: white; }
.btn-indigo:hover { background-color: #4338ca; color: white; }
.border-bottom-2 { border-bottom-width: 2px; }

@keyframes pop {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.animate-pop { animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
