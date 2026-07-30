<template>
    <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-2">
                <router-link to="/borrows" class="btn btn-slate-light p-2 rounded-lg text-slate-600 hover:text-slate-900">
                    <ArrowLeft :size="18" />
                </router-link>
                <div>
                    <h5 class="fw-bold text-slate-900 tracking-tight mb-0">Lập Phiếu Mượn Sách Mới</h5>
                    <span class="text-slate-500 fs-7">Cấp quyền lưu giữ sách cho độc giả có thẻ thành viên</span>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="p-4 p-md-5">
                <form @submit.prevent="handleSubmit">
                    <!-- Choose Reader -->
                    <div class="mb-4">
                        <label class="form-label">Chọn Độc Giả <span class="text-rose-500">*</span></label>
                        <select v-model="formData.docGia" class="form-select rounded-lg" required>
                            <option value="" disabled>-- Chọn độc giả thực hiện mượn --</option>
                            <option v-for="reader in readers" :key="reader._id" :value="reader._id">
                                {{ reader.maDocGia }} - {{ reader.hoLot }} {{ reader.ten }} (ĐT: {{ reader.dienThoai }})
                            </option>
                        </select>
                    </div>

                    <!-- Choose Book -->
                    <div class="mb-4">
                        <label class="form-label">Chọn Đầu Sách Mượn <span class="text-rose-500">*</span></label>
                        <select v-model="formData.sach" class="form-select rounded-lg" required>
                            <option value="" disabled>-- Chọn đầu sách cần mượn --</option>
                            <option 
                                v-for="book in books" 
                                :key="book._id" 
                                :value="book._id" 
                                :disabled="book.soQuyen <= 0"
                            >
                                {{ book.maSach }} - {{ book.tenSach }} (Còn {{ book.soQuyen }} quyển)
                            </option>
                        </select>
                        <div class="fs-8 text-slate-400 mt-1 d-flex align-items-center gap-1">
                            <Info :size="14" />
                            <span>Sách có số lượng tồn kho bằng 0 sẽ bị vô hiệu hóa.</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="pt-4 border-top border-slate-100 d-flex align-items-center justify-content-end gap-2">
                        <router-link to="/borrows" class="btn btn-slate-light px-4 py-2 rounded-lg text-slate-700 fw-medium">
                            Hủy bỏ
                        </router-link>
                        <button type="submit" class="btn btn-primary px-4 py-2 rounded-lg fw-semibold d-flex align-items-center gap-2 shadow-xs" :disabled="isSaving">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                            <CheckCircle2 v-else :size="18" />
                            <span>Hoàn Tất Phiếu Mượn</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import borrowService from '../../services/borrow.service';
import readerService from '../../services/reader.service';
import bookService from '../../services/book.service';
import { useToastStore } from '../../stores/toast.store';
import { ArrowLeft, CheckCircle2, Info } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const isSaving = ref(false);
const formData = ref({ docGia: '', sach: '' });
const readers = ref([]);
const books = ref([]);

const fetchInitialData = async () => {
    try {
        const [readerRes, bookRes] = await Promise.all([
            readerService.getAll({ limit: 100 }),
            bookService.getAll({ limit: 100 })
        ]);
        readers.value = readerRes.data;
        books.value = bookRes.data;

        // Auto select book if bookId passed in query
        if (route.query.bookId) {
            formData.value.sach = route.query.bookId;
        }
    } catch (error) {
        toast.error('Lỗi khi tải dữ liệu khởi tạo.');
    }
};

const handleSubmit = async () => {
    isSaving.value = true;
    try {
        await borrowService.create(formData.value);
        toast.success('Lập phiếu mượn sách thành công! Kho sách đã trừ 1 quyển.');
        router.push('/borrows');
    } catch (error) {
        toast.error(error.message || 'Lỗi khi mượn sách.');
    } finally {
        isSaving.value = false;
    }
};

onMounted(fetchInitialData);
</script>

<style scoped>
.max-w-2xl { max-width: 672px; }
.text-rose-500 { color: #f43f5e; }
</style>
