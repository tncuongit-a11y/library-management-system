<template>
    <div
        class="min-vh-100 d-flex align-items-center justify-content-center bg-slate-900 p-3 p-sm-4 position-relative overflow-hidden">
        <!-- Ambient background glow -->
        <div class="position-absolute top-0 start-50 translate-middle-x rounded-full bg-indigo-600/10 blur-3xl"
            style="width: 600px; height: 600px; pointer-events: none;"></div>

        <div class="w-100 max-w-md position-relative z-10">
            <!-- Brand Badge -->
            <div class="text-center mb-4">
                <router-link to="/" class="d-inline-flex align-items-center justify-content-center p-3 rounded-2xl bg-indigo-600 text-white shadow-xl mb-3 border border-indigo-500/30 text-decoration-none">
                    <Library :size="32" />
                </router-link>
                <h4 class="fw-bold text-white tracking-tight mb-1">Thư Viện Số Enterprise</h4>
                <p class="text-slate-400 fs-7">Hệ thống Đăng ký & Mượn sách trực tuyến</p>
            </div>

            <!-- Card -->
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <!-- Role Selector Tabs -->
                <div class="d-flex border-bottom border-slate-100 bg-slate-50">
                    <button 
                        type="button" 
                        class="flex-1 py-3 fs-7 fw-bold transition-all border-bottom-2 border-0 bg-transparent"
                        :class="loginType === 'reader' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-500 border-transparent hover:text-slate-900'"
                        @click="loginType = 'reader'; authStore.error = null"
                    >
                        Dành Cho Độc Giả
                    </button>
                    <button 
                        type="button" 
                        class="flex-1 py-3 fs-7 fw-bold transition-all border-bottom-2 border-0 bg-transparent"
                        :class="loginType === 'staff' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-500 border-transparent hover:text-slate-900'"
                        @click="loginType = 'staff'; authStore.error = null"
                    >
                        Nhân Viên Quản Lý
                    </button>
                </div>

                <div class="p-4 p-sm-5">
                    <!-- Global Error -->
                    <div v-if="authStore.error"
                        class="alert alert-rose bg-rose-50 text-rose-700 border border-rose-200 rounded-xl p-3 mb-4 fs-8 d-flex align-items-center gap-2">
                        <AlertCircle :size="18" class="text-rose-600 flex-shrink-0" />
                        <span>{{ authStore.error }}</span>
                    </div>

                    <!-- 1. READER LOGIN & REGISTER -->
                    <template v-if="loginType === 'reader'">
                        <!-- Mode toggle (Login vs Register) -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 class="fw-bold text-slate-900 mb-1">
                                    {{ readerMode === 'login' ? 'Đăng Nhập Độc Giả' : 'Tạo Tài Khoản Độc Giả' }}
                                </h5>
                                <p class="text-slate-500 fs-8 mb-0">
                                    {{ readerMode === 'login' ? 'Tra cứu, gia hạn & mượn sách dễ dàng' : 'Đăng ký ngay chỉ với số điện thoại' }}
                                </p>
                            </div>
                            <button 
                                type="button" 
                                class="btn btn-link text-indigo-600 p-0 fs-8 fw-semibold text-decoration-none"
                                @click="readerMode = readerMode === 'login' ? 'register' : 'login'; authStore.error = null"
                            >
                                {{ readerMode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
                            </button>
                        </div>

                        <!-- Reader Login Form -->
                        <form v-if="readerMode === 'login'" @submit.prevent="handleReaderLogin">
                            <div class="mb-3">
                                <label class="form-label text-slate-700 fw-semibold fs-8">Số điện thoại / Mã độc giả</label>
                                <div class="position-relative">
                                    <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                        <User :size="18" />
                                    </span>
                                    <input 
                                        type="text" 
                                        v-model="readerAccount"
                                        class="form-control ps-5 py-2.5 rounded-xl text-slate-900 fw-medium fs-7"
                                        placeholder="Nhập SĐT (090...) hoặc Mã ĐG (DG001)" 
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
                                        type="password" 
                                        v-model="readerPassword"
                                        class="form-control ps-5 py-2.5 rounded-xl text-slate-900 fw-medium fs-7"
                                        placeholder="Nhập mật khẩu..." 
                                        required 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                class="btn btn-indigo w-100 py-2.5 rounded-xl fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white"
                                :disabled="authStore.isLoading"
                            >
                                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm"></span>
                                <template v-else>
                                    <span>Vào Cổng Độc Giả</span>
                                    <ArrowRight :size="18" />
                                </template>
                            </button>
                        </form>

                        <!-- Reader Register Form -->
                        <form v-else @submit.prevent="handleReaderRegister">
                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <label class="form-label text-slate-700 fw-semibold fs-8">Họ & Tên lót *</label>
                                    <input v-model="registerForm.hoLot" type="text" class="form-control rounded-xl fs-8 py-2" placeholder="Nguyễn Văn" required />
                                </div>
                                <div class="col-6">
                                    <label class="form-label text-slate-700 fw-semibold fs-8">Tên *</label>
                                    <input v-model="registerForm.ten" type="text" class="form-control rounded-xl fs-8 py-2" placeholder="An" required />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label text-slate-700 fw-semibold fs-8">Số điện thoại *</label>
                                <div class="position-relative">
                                    <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                        <Phone :size="16" />
                                    </span>
                                    <input v-model="registerForm.dienThoai" type="tel" class="form-control ps-5 rounded-xl fs-8 py-2" placeholder="0981234567" required />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label text-slate-700 fw-semibold fs-8">Địa chỉ *</label>
                                <input v-model="registerForm.diaChi" type="text" class="form-control rounded-xl fs-8 py-2" placeholder="Địa chỉ nơi ở..." required />
                            </div>

                            <div class="mb-4">
                                <label class="form-label text-slate-700 fw-semibold fs-8">Mật khẩu *</label>
                                <div class="position-relative">
                                    <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                        <Lock :size="16" />
                                    </span>
                                    <input v-model="registerForm.matKhau" type="password" class="form-control ps-5 rounded-xl fs-8 py-2" placeholder="Tối thiểu 6 ký tự" required minlength="6" />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                class="btn btn-indigo w-100 py-2.5 rounded-xl fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white"
                                :disabled="authStore.isLoading"
                            >
                                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm"></span>
                                <template v-else>
                                    <UserPlus :size="18" />
                                    <span>Tạo Tài Khoản Độc Giả</span>
                                </template>
                            </button>
                        </form>
                    </template>

                    <!-- 2. STAFF LOGIN -->
                    <template v-else>
                        <div class="mb-4">
                            <h5 class="fw-bold text-slate-900 mb-1">Đăng nhập Quản Trị</h5>
                            <p class="text-slate-500 fs-8 mb-0">Dành riêng cho nhân viên và thủ thư thư viện</p>
                        </div>

                        <form @submit.prevent="handleStaffLogin">
                            <div class="mb-3">
                                <label class="form-label text-slate-700 fw-semibold fs-8">Mã số nhân viên (MSNV)</label>
                                <div class="position-relative">
                                    <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                        <UserCheck :size="18" />
                                    </span>
                                    <input type="text" v-model="msnv"
                                        class="form-control ps-5 py-2.5 rounded-xl text-slate-900 fw-medium fs-7"
                                        placeholder="Nhập mã nhân viên (ví dụ: NV001)" required />
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label text-slate-700 fw-semibold fs-8">Mật khẩu</label>
                                <div class="position-relative">
                                    <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                        <Lock :size="18" />
                                    </span>
                                    <input type="password" v-model="password"
                                        class="form-control ps-5 py-2.5 rounded-xl text-slate-900 fw-medium fs-7"
                                        placeholder="Nhập mật khẩu..." required />
                                </div>
                            </div>

                            <button type="submit"
                                class="btn btn-primary w-100 py-2.5 rounded-xl fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                                :disabled="authStore.isLoading">
                                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm"></span>
                                <template v-else>
                                    <span>Đăng Nhập Quản Lý</span>
                                    <ArrowRight :size="18" />
                                </template>
                            </button>
                        </form>

                        <div class="mt-4 pt-3 border-top border-slate-100 bg-slate-50 p-3 rounded-xl">
                            <div class="d-flex align-items-center gap-2 text-slate-600 fs-8 fw-semibold mb-1">
                                <ShieldCheck :size="14" class="text-indigo-600" />
                                <span>Tài khoản thử nghiệm NV:</span>
                            </div>
                            <div class="d-flex justify-content-between text-slate-500 fs-8">
                                <span>Mã NV: <code class="text-indigo-600 fw-bold">NV001</code></span>
                                <span>Mật khẩu: <code class="text-indigo-600 fw-bold">password123</code></span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Back to Home -->
            <div class="text-center mt-4">
                <router-link to="/" class="text-slate-400 hover:text-white fs-8 text-decoration-none">
                    &larr; Quay lại trang chủ Thư Viện
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useToastStore } from '../stores/toast.store';
import { Library, UserCheck, Lock, ArrowRight, ShieldCheck, AlertCircle, User, Phone, UserPlus } from 'lucide-vue-next';

const loginType = ref('reader'); // 'reader' | 'staff'
const readerMode = ref('login'); // 'login' | 'register'

// Staff form
const msnv = ref('NV001');
const password = ref('password123');

// Reader form
const readerAccount = ref('');
const readerPassword = ref('');

// Register form
const registerForm = ref({
    hoLot: '',
    ten: '',
    dienThoai: '',
    diaChi: '',
    matKhau: ''
});

const authStore = useAuthStore();
const toast = useToastStore();
const router = useRouter();

const handleStaffLogin = async () => {
    const success = await authStore.login(msnv.value, password.value);
    if (success) {
        toast.success('Đăng nhập quản trị thành công');
        router.push({ name: 'Dashboard' });
    }
};

const handleReaderLogin = async () => {
    const success = await authStore.readerLogin(readerAccount.value, readerPassword.value);
    if (success) {
        toast.success(`Xin chào, ${authStore.user?.hoTen || 'Độc giả'}!`);
        router.push({ name: 'ReaderPortal' });
    }
};

const handleReaderRegister = async () => {
    const success = await authStore.readerRegister(registerForm.value);
    if (success) {
        toast.success('Đăng ký tài khoản độc giả thành công!');
        router.push({ name: 'ReaderPortal' });
    }
};
</script>

<style scoped>
.max-w-md {
    max-width: 440px;
}
.btn-indigo {
    background-color: #4f46e5;
    color: white;
}
.btn-indigo:hover {
    background-color: #4338ca;
    color: white;
}
.border-bottom-2 {
    border-bottom-width: 2px;
}
</style>

