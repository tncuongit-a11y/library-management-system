<template>
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-2">
                <router-link to="/books" class="btn btn-slate-light p-2 rounded-lg text-slate-600 hover:text-slate-900">
                    <ArrowLeft :size="18" />
                </router-link>
                <div>
                    <h5 class="fw-bold text-slate-900 tracking-tight mb-0">
                        {{ isEditMode ? 'Chỉnh Sửa Thông Tin Sách' : 'Thêm Đầu Sách Mới' }}
                    </h5>
                    <span class="text-slate-500 fs-7">Khai báo thông tin lưu kho và giá bìa sách</span>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="p-4 p-md-5">
                <form @submit.prevent="handleSubmit">
                    <div class="row g-4">
                        <!-- Left Column: Book Cover Image Picker -->
                        <div class="col-md-4 text-center">
                            <label class="form-label text-slate-700 fw-semibold fs-7 mb-2 d-block text-start">Ảnh Bìa Sách</label>
                            
                            <div class="mb-3">
                                <BookCover 
                                    :cover-url="formData.hinhAnh" 
                                    :title="formData.tenSach" 
                                    :author="formData.tacGia" 
                                    :code="formData.maSach" 
                                    height="240px"
                                    container-class="shadow-md rounded-xl mx-auto max-w-200"
                                />
                            </div>

                            <!-- Upload Options -->
                            <div class="mb-3">
                                <label class="btn btn-slate-light btn-sm w-100 rounded-lg text-slate-700 fw-medium d-flex align-items-center justify-content-center gap-2 border border-slate-200 cursor-pointer">
                                    <Upload :size="16" />
                                    <span>Tải ảnh từ thiết bị</span>
                                    <input type="file" accept="image/*" class="d-none" @change="handleFileUpload" />
                                </label>
                            </div>

                            <div>
                                <label class="form-label text-slate-500 fs-8 d-block text-start mb-1">Hoặc dán Đường dẫn ảnh (URL):</label>
                                <input 
                                    type="url" 
                                    v-model="formData.hinhAnh" 
                                    class="form-control form-control-sm text-slate-800" 
                                    placeholder="https://example.com/cover.jpg" 
                                />
                            </div>
                        </div>

                        <!-- Right Column: Text Metadata -->
                        <div class="col-md-8">
                            <div class="row g-3">
                                <!-- Mã Sách -->
                                <div class="col-md-6">
                                    <label class="form-label">Mã Sách <span class="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        v-model="formData.maSach" 
                                        class="form-control uppercase fw-semibold" 
                                        required 
                                        :disabled="isEditMode" 
                                        placeholder="VD: SACH001" 
                                    />
                                    <div class="fs-8 text-slate-400 mt-1">Dùng để định danh sách trong thư viện</div>
                                </div>

                                <!-- Tên Sách -->
                                <div class="col-md-6">
                                    <label class="form-label">Tên Sách <span class="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        v-model="formData.tenSach" 
                                        class="form-control fw-medium" 
                                        required 
                                        placeholder="Nhập tên đầu sách..." 
                                    />
                                </div>

                                <!-- Tác Giả -->
                                <div class="col-md-6">
                                    <label class="form-label">Tác Giả <span class="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        v-model="formData.tacGia" 
                                        class="form-control" 
                                        required 
                                        placeholder="Nhập tên tác giả..." 
                                    />
                                </div>

                                <!-- Nhà Xuất Bản -->
                                <div class="col-md-6">
                                    <label class="form-label">Nhà Xuất Bản <span class="text-rose-500">*</span></label>
                                    <select v-model="formData.nhaXuatBan" class="form-select" required>
                                        <option value="" disabled>-- Chọn Nhà Xuất Bản --</option>
                                        <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
                                            {{ pub.tenNXB }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Năm Xuất Bản -->
                                <div class="col-md-4">
                                    <label class="form-label">Năm Xuất Bản <span class="text-rose-500">*</span></label>
                                    <input 
                                        type="number" 
                                        v-model.number="formData.namXuatBan" 
                                        class="form-control" 
                                        required 
                                        min="1000" 
                                        :max="new Date().getFullYear()" 
                                    />
                                </div>

                                <!-- Đơn Giá -->
                                <div class="col-md-4">
                                    <label class="form-label">Đơn Giá (VNĐ) <span class="text-rose-500">*</span></label>
                                    <input 
                                        type="number" 
                                        v-model.number="formData.donGia" 
                                        class="form-control" 
                                        required 
                                        min="0" 
                                        step="1000" 
                                    />
                                </div>

                                <!-- Số Quyển -->
                                <div class="col-md-4">
                                    <label class="form-label">Số Quyển Tồn Kho <span class="text-rose-500">*</span></label>
                                    <input 
                                        type="number" 
                                        v-model.number="formData.soQuyen" 
                                        class="form-control" 
                                        required 
                                        min="0" 
                                    />
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="mt-4 pt-4 border-top border-slate-100 d-flex align-items-center justify-content-end gap-2">
                                <router-link to="/books" class="btn btn-slate-light px-4 py-2 rounded-lg text-slate-700 fw-medium">
                                    Hủy bỏ
                                </router-link>
                                <button type="submit" class="btn btn-primary px-4 py-2 rounded-lg fw-semibold d-flex align-items-center gap-2 shadow-xs" :disabled="isSaving">
                                    <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                                    <Save v-else :size="18" />
                                    <span>{{ isEditMode ? 'Lưu Thay Đổi' : 'Thêm Sách Mới' }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import bookService from '../../services/book.service';
import publisherService from '../../services/publisher.service';
import { useToastStore } from '../../stores/toast.store';
import BookCover from '../../components/BookCover.vue';
import { ArrowLeft, Upload, Save } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const isEditMode = computed(() => !!route.params.id);
const isSaving = ref(false);
const publishers = ref([]);

const formData = ref({
    maSach: '',
    tenSach: '',
    tacGia: '',
    hinhAnh: '',
    nhaXuatBan: '',
    namXuatBan: new Date().getFullYear(),
    donGia: 0,
    soQuyen: 1
});

const fetchPublishers = async () => {
    try {
        const response = await publisherService.getAll({ limit: 100 });
        publishers.value = response.data;
    } catch (error) {
        console.error('Lỗi khi tải NXB:', error);
    }
};

const fetchBookDetail = async () => {
    if (!isEditMode.value) return;
    try {
        const response = await bookService.get(route.params.id);
        const book = response.data;
        formData.value = {
            maSach: book.maSach,
            tenSach: book.tenSach,
            tacGia: book.tacGia,
            hinhAnh: book.hinhAnh || '',
            nhaXuatBan: book.nhaXuatBan?._id || book.nhaXuatBan,
            namXuatBan: book.namXuatBan,
            donGia: book.donGia,
            soQuyen: book.soQuyen
        };
    } catch (error) {
        toast.error('Không tìm thấy thông tin sách.');
        router.push('/books');
    }
};

const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            toast.warning('Kích thước ảnh nên nhỏ hơn 2MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            formData.value.hinhAnh = event.target.result;
            toast.info('Đã tải ảnh lên thành công.');
        };
        reader.readAsDataURL(file);
    }
};

const handleSubmit = async () => {
    isSaving.value = true;
    try {
        if (isEditMode.value) {
            await bookService.update(route.params.id, formData.value);
            toast.success('Cập nhật thông tin sách thành công!');
        } else {
            await bookService.create(formData.value);
            toast.success('Thêm sách mới thành công!');
        }
        router.push('/books');
    } catch (error) {
        toast.error(error.message || 'Lỗi khi lưu thông tin sách.');
    } finally {
        isSaving.value = false;
    }
};

onMounted(() => {
    fetchPublishers();
    fetchBookDetail();
});
</script>

<style scoped>
.max-w-200 { max-width: 200px; }
.text-rose-500 { color: #f43f5e; }
.cursor-pointer { cursor: pointer; }
</style>
