<template>
    <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-2">
                <router-link to="/publishers" class="btn btn-slate-light p-2 rounded-lg text-slate-600 hover:text-slate-900">
                    <ArrowLeft :size="18" />
                </router-link>
                <div>
                    <h5 class="fw-bold text-slate-900 tracking-tight mb-0">
                        {{ isEditMode ? 'Cập Nhật Nhà Xuất Bản' : 'Khai Báo Nhà Xuất Bản Mới' }}
                    </h5>
                    <span class="text-slate-500 fs-7">Quản lý đối tác phát hành và nguồn cung cấp đầu sách</span>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="p-4 p-md-5">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label class="form-label">Mã Nhà Xuất Bản <span class="text-rose-500">*</span></label>
                        <input 
                            type="text" 
                            v-model="formData.maNXB" 
                            class="form-control uppercase fw-semibold" 
                            required 
                            :disabled="isEditMode"
                            placeholder="VD: NXB001"
                        />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Tên Nhà Xuất Bản <span class="text-rose-500">*</span></label>
                        <input 
                            type="text" 
                            v-model="formData.tenNXB" 
                            class="form-control fw-medium" 
                            required
                            placeholder="Nhập tên nhà xuất bản..."
                        />
                    </div>

                    <div class="mb-4">
                        <label class="form-label">Địa Chỉ Trụ Sở <span class="text-rose-500">*</span></label>
                        <input 
                            type="text" 
                            v-model="formData.diaChi" 
                            class="form-control" 
                            required
                            placeholder="Nhập địa chỉ nhà xuất bản..."
                        />
                    </div>

                    <!-- Actions -->
                    <div class="pt-4 border-top border-slate-100 d-flex align-items-center justify-content-end gap-2">
                        <router-link to="/publishers" class="btn btn-slate-light px-4 py-2 rounded-lg text-slate-700 fw-medium">
                            Hủy bỏ
                        </router-link>
                        <button type="submit" class="btn btn-primary px-4 py-2 rounded-lg fw-semibold d-flex align-items-center gap-2 shadow-xs" :disabled="isSaving">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                            <Save v-else :size="18" />
                            <span>{{ isEditMode ? 'Lưu Thay Đổi' : 'Tạo NXB Mới' }}</span>
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
import publisherService from '../../services/publisher.service';
import { useToastStore } from '../../stores/toast.store';
import { ArrowLeft, Save } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const isEditMode = computed(() => !!route.params.id);
const isSaving = ref(false);

const formData = ref({
    maNXB: '',
    tenNXB: '',
    diaChi: ''
});

onMounted(async () => {
    if (isEditMode.value) {
        try {
            const res = await publisherService.get(route.params.id);
            formData.value = res.data;
        } catch (error) {
            toast.error('Không tìm thấy nhà xuất bản.');
            router.push('/publishers');
        }
    }
});

const handleSubmit = async () => {
    isSaving.value = true;
    try {
        if (isEditMode.value) {
            await publisherService.update(route.params.id, formData.value);
            toast.success('Cập nhật NXB thành công!');
        } else {
            await publisherService.create(formData.value);
            toast.success('Thêm NXB mới thành công!');
        }
        router.push('/publishers');
    } catch (error) {
        toast.error(error.message || 'Có lỗi xảy ra khi lưu NXB.');
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
.max-w-2xl { max-width: 672px; }
.text-rose-500 { color: #f43f5e; }
</style>
