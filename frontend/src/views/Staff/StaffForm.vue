<template>
    <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-2">
                <router-link to="/staffs" class="btn btn-slate-light p-2 rounded-lg text-slate-600 hover:text-slate-900">
                    <ArrowLeft :size="18" />
                </router-link>
                <div>
                    <h5 class="fw-bold text-slate-900 tracking-tight mb-0">
                        {{ isEditMode ? 'Cập Nhật Hồ Sơ Nhân Viên' : 'Khai Báo Nhân Viên Mới' }}
                    </h5>
                    <span class="text-slate-500 fs-7">Cấp tài khoản và phân quyền quản trị hệ thống</span>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="p-4 p-md-5">
                <form @submit.prevent="handleSubmit">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Mã Số Nhân Viên <span class="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="formData.msnv" 
                                class="form-control uppercase fw-semibold" 
                                required 
                                :disabled="isEditMode"
                                placeholder="VD: NV002"
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Họ và Tên <span class="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="formData.hoTen" 
                                class="form-control fw-semibold" 
                                required
                                placeholder="Nhập họ tên nhân viên..."
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                Mật Khẩu {{ isEditMode ? '(Để trống nếu không đổi)' : '*' }}
                            </label>
                            <input 
                                type="password" 
                                v-model="formData.password" 
                                class="form-control" 
                                :required="!isEditMode"
                                placeholder="Nhập mật khẩu..."
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Chức Vụ / Phân Quyền <span class="text-rose-500">*</span></label>
                            <select v-model="formData.chucVu" class="form-select" required>
                                <option value="Nhân viên">Nhân viên (Quyền cơ bản)</option>
                                <option value="Quản lý">Quản lý (Quyền quản trị toàn hệ thống)</option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Số Điện Thoại <span class="text-rose-500">*</span></label>
                            <input 
                                type="tel" 
                                v-model="formData.soDienThoai" 
                                class="form-control" 
                                required
                                placeholder="Nhập số điện thoại..."
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Địa Chỉ Công Tác / Thường Trú <span class="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="formData.diaChi" 
                                class="form-control" 
                                required
                                placeholder="Nhập địa chỉ..."
                            />
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-4 pt-4 border-top border-slate-100 d-flex align-items-center justify-content-end gap-2">
                        <router-link to="/staffs" class="btn btn-slate-light px-4 py-2 rounded-lg text-slate-700 fw-medium">
                            Hủy bỏ
                        </router-link>
                        <button type="submit" class="btn btn-primary px-4 py-2 rounded-lg fw-semibold d-flex align-items-center gap-2 shadow-xs" :disabled="isSaving">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                            <Save v-else :size="18" />
                            <span>{{ isEditMode ? 'Lưu Thay Đổi' : 'Tạo Nhân Viên' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import staffService from '../../services/staff.service';
import { useToastStore } from '../../stores/toast.store';
import { ArrowLeft, Save } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const isEditMode = computed(() => !!route.params.id);
const isSaving = ref(false);

const formData = ref({
    msnv: '',
    hoTen: '',
    password: '',
    chucVu: 'Nhân viên',
    diaChi: '',
    soDienThoai: ''
});

onMounted(async () => {
    if (isEditMode.value) {
        try {
            const res = await staffService.get(route.params.id);
            const data = res.data;
            delete data.password;
            formData.value = { ...formData.value, ...data };
        } catch (error) {
            toast.error('Không tìm thấy thông tin nhân viên.');
            router.push('/staffs');
        }
    }
});

const handleSubmit = async () => {
    isSaving.value = true;
    try {
        const submitData = { ...formData.value };
        if (isEditMode.value && !submitData.password) {
            delete submitData.password;
        }

        if (isEditMode.value) {
            await staffService.update(route.params.id, submitData);
            toast.success('Cập nhật nhân viên thành công!');
        } else {
            await staffService.create(submitData);
            toast.success('Thêm nhân viên mới thành công!');
        }
        router.push('/staffs');
    } catch (error) {
        toast.error(error.message || 'Lỗi khi lưu thông tin nhân viên.');
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
.max-w-3xl { max-width: 768px; }
.text-rose-500 { color: #f43f5e; }
</style>
