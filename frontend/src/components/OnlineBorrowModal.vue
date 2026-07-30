<template>
    <div v-if="isOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3 z-3">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-100 max-w-lg overflow-hidden animate-pop">
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between p-4 border-bottom border-slate-100 bg-indigo-50/50">
                <div class="d-flex align-items-center gap-2.5">
                    <div class="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                        <BookmarkCheck :size="20" />
                    </div>
                    <div>
                        <h5 class="fw-bold text-slate-900 mb-0">Đăng Ký Mượn Sách Trực Tuyến</h5>
                        <span class="text-slate-500 fs-8">Sách: <strong class="text-indigo-600">{{ book?.tenSach }}</strong></span>
                    </div>
                </div>
                <button type="button" class="btn btn-slate-light p-1.5 rounded-lg text-slate-500 hover:text-slate-900" @click="$emit('close')">
                    <X :size="20" />
                </button>
            </div>

            <!-- Form Body -->
            <form @submit.prevent="handleSubmit" class="p-4 p-md-5">
                <div class="alert alert-indigo d-flex align-items-center gap-2 fs-8 mb-4">
                    <Info :size="18" class="text-indigo-600 flex-shrink-0" />
                    <span>Sau khi hoàn tất đăng ký, thủ thư sẽ duyệt yêu cầu và chuẩn bị sách cho bạn tại quầy.</span>
                </div>

                <div class="row g-3">
                    <div class="col-12 col-sm-6">
                        <label class="form-label fs-8 fw-bold text-slate-700">Họ và Tên lót <span class="text-rose-500">*</span></label>
                        <input v-model="form.hoLot" type="text" class="form-control rounded-lg fs-7" placeholder="Ví dụ: Nguyễn Văn" required />
                    </div>

                    <div class="col-12 col-sm-6">
                        <label class="form-label fs-8 fw-bold text-slate-700">Tên độc giả <span class="text-rose-500">*</span></label>
                        <input v-model="form.ten" type="text" class="form-control rounded-lg fs-7" placeholder="Ví dụ: An" required />
                    </div>

                    <div class="col-12">
                        <label class="form-label fs-8 fw-bold text-slate-700">Số điện thoại liên hệ <span class="text-rose-500">*</span></label>
                        <div class="position-relative">
                            <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                <Phone :size="16" />
                            </span>
                            <input v-model="form.dienThoai" type="tel" class="form-control ps-5 rounded-lg fs-7" placeholder="090XXXXXXX" required />
                        </div>
                    </div>

                    <div class="col-12">
                        <label class="form-label fs-8 fw-bold text-slate-700">Địa chỉ</label>
                        <input v-model="form.diaChi" type="text" class="form-control rounded-lg fs-7" placeholder="Nhập địa chỉ nhà hoặc trường học..." />
                    </div>

                    <div class="col-12">
                        <label class="form-label fs-8 fw-bold text-slate-700">Ghi chú thêm</label>
                        <textarea v-model="form.ghiChu" class="form-control rounded-lg fs-7" rows="2" placeholder="Ghi chú thời gian dự kiến đến nhận sách..."></textarea>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-4 pt-3 border-top border-slate-100 d-flex align-items-center justify-content-end gap-2">
                    <button type="button" class="btn btn-slate-light px-4 fs-7" @click="$emit('close')">
                        Hủy
                    </button>
                    <button type="submit" class="btn btn-indigo px-4 fs-7 d-flex align-items-center gap-2 fw-semibold shadow-xs" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm"></span>
                        <Send v-else :size="16" />
                        <span>Gửi Yêu Cầu Mượn</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import borrowService from '../services/borrow.service';
import { useToastStore } from '../stores/toast.store';
import { BookmarkCheck, X, Phone, Info, Send } from 'lucide-vue-next';

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    book: { type: Object, default: null }
});

const emit = defineEmits(['close', 'success']);
const toast = useToastStore();

const isSubmitting = ref(false);
const form = ref({
    hoLot: '',
    ten: '',
    dienThoai: '',
    diaChi: '',
    ghiChu: ''
});

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        form.value = { hoLot: '', ten: '', dienThoai: '', diaChi: '', ghiChu: '' };
    }
});

const handleSubmit = async () => {
    if (!props.book?._id) return;
    isSubmitting.value = true;
    try {
        await borrowService.createOnlineRequest({
            sachId: props.book._id,
            hoLot: form.value.hoLot,
            ten: form.value.ten,
            dienThoai: form.value.dienThoai,
            diaChi: form.value.diaChi,
            ghiChu: form.value.ghiChu
        });
        toast.success('Gửi yêu cầu mượn sách thành công! Thư viện sẽ liên hệ duyệt trong thời gian ngắn nhất.');
        emit('success');
        emit('close');
    } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Lỗi khi gửi yêu cầu mượn.');
    } finally {
        isSubmitting.value = false;
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
.max-w-lg { max-width: 520px; }
.btn-indigo { background-color: #4f46e5; color: white; }
.btn-indigo:hover { background-color: #4338ca; color: white; }
.alert-indigo { background-color: #eef2ff; color: #3730a3; border: 1px solid #e0e7ff; }
@keyframes pop {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.animate-pop { animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
