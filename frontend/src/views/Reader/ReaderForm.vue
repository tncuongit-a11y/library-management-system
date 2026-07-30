<template>
    <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-2">
                <router-link to="/readers" class="btn btn-slate-light p-2 rounded-lg text-slate-600 hover:text-slate-900">
                    <ArrowLeft :size="18" />
                </router-link>
                <div>
                    <h5 class="fw-bold text-slate-900 tracking-tight mb-0">
                        {{ isEditMode ? 'Cập Nhật Thông Tin Độc Giả' : 'Đăng Ký Độc Giả Mới' }}
                    </h5>
                    <span class="text-slate-500 fs-7">Cấp thông tin thẻ đọc mượn sách thư viện</span>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="p-4 p-md-5">
                <form @submit.prevent="handleSubmit">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Mã Độc Giả <span class="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="formData.maDocGia" 
                                class="form-control uppercase fw-semibold" 
                                required 
                                :disabled="isEditMode"
                                placeholder="VD: DG001"
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Số Điện Thoại <span class="text-rose-500">*</span></label>
                            <input 
                                type="tel" 
                                v-model="formData.dienThoai" 
                                class="form-control fw-medium" 
                                required
                                placeholder="Nhập số điện thoại..."
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Họ Lót <span class="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="formData.hoLot" 
                                class="form-control" 
                                required
                                placeholder="Nhập họ lót (ví dụ: Nguyễn Văn)"
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Tên <span class="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="formData.ten" 
                                class="form-control fw-semibold" 
                                required
                                placeholder="Nhập tên (ví dụ: An)"
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Ngày Sinh <span class="text-rose-500">*</span></label>
                            <input 
                                type="date" 
                                v-model="formData.ngaySinh" 
                                class="form-control" 
                                required
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Giới Tính / Phái <span class="text-rose-500">*</span></label>
                            <select v-model="formData.phai" class="form-select" required>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label class="form-label">Địa Chỉ Liên Hệ <span class="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="formData.diaChi" 
                                class="form-control" 
                                required
                                placeholder="Nhập địa chỉ độc giả..."
                            />
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-4 pt-4 border-top border-slate-100 d-flex align-items-center justify-content-end gap-2">
                        <router-link to="/readers" class="btn btn-slate-light px-4 py-2 rounded-lg text-slate-700 fw-medium">
                            Hủy bỏ
                        </router-link>
                        <button type="submit" class="btn btn-primary px-4 py-2 rounded-lg fw-semibold d-flex align-items-center gap-2 shadow-xs" :disabled="isSaving">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                            <Save v-else :size="18" />
                            <span>{{ isEditMode ? 'Lưu Thay Đổi' : 'Đăng Ký Độc Giả' }}</span>
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
import readerService from '../../services/reader.service';
import { useToastStore } from '../../stores/toast.store';
import { ArrowLeft, Save } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const isEditMode = computed(() => !!route.params.id);
const isSaving = ref(false);

const formData = ref({
    maDocGia: '',
    hoLot: '',
    ten: '',
    ngaySinh: '',
    phai: 'Khác',
    diaChi: '',
    dienThoai: ''
});

const fetchDetail = async () => {
    if (!isEditMode.value) return;
    try {
        const res = await readerService.get(route.params.id);
        const data = res.data;
        if (data.ngaySinh) {
            data.ngaySinh = new Date(data.ngaySinh).toISOString().split('T')[0];
        }
        formData.value = data;
    } catch (error) {
        toast.error('Lấy thông tin độc giả thất bại.');
        router.push('/readers');
    }
};

const handleSubmit = async () => {
    isSaving.value = true;
    try {
        if (isEditMode.value) {
            await readerService.update(route.params.id, formData.value);
            toast.success('Cập nhật thông tin độc giả thành công!');
        } else {
            await readerService.create(formData.value);
            toast.success('Thêm độc giả mới thành công!');
        }
        router.push('/readers');
    } catch (error) {
        toast.error(error.message || 'Lỗi khi lưu thông tin độc giả.');
    } finally {
        isSaving.value = false;
    }
};

onMounted(fetchDetail);
</script>

<style scoped>
.max-w-3xl { max-width: 768px; }
.text-rose-500 { color: #f43f5e; }
</style>
