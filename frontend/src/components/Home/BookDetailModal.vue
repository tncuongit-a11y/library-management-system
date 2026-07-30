<template>
    <div v-if="isOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3 z-3">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-100 max-w-3xl overflow-hidden animate-pop">
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between p-4 border-bottom border-slate-100 bg-slate-50/50">
                <div class="d-flex align-items-center gap-2.5">
                    <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <BookOpen :size="20" />
                    </div>
                    <div>
                        <h5 class="fw-bold text-slate-900 mb-0">Thông Tin Chi Tiết Sách</h5>
                        <span class="text-slate-500 fs-8">Mã tra cứu: <span class="fw-mono text-indigo-600 fw-bold">{{ book?.maSach }}</span></span>
                    </div>
                </div>
                <button type="button" class="btn btn-slate-light p-1.5 rounded-lg text-slate-500 hover:text-slate-900" @click="$emit('close')">
                    <X :size="20" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-4 p-md-5 overflow-y-auto" style="max-height: 75vh;">
                <div class="row g-4">
                    <!-- Book Cover Column -->
                    <div class="col-12 col-md-5 text-center">
                        <div class="position-relative d-inline-block rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 w-100" style="max-width: 240px; aspect-ratio: 3/4;">
                            <img 
                                v-if="book?.hinhAnh" 
                                :src="book.hinhAnh" 
                                :alt="book.tenSach"
                                class="w-100 h-100 object-fit-cover"
                                @error="handleImageError"
                            />
                            <div v-else class="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-gradient-to-br p-3 text-center text-slate-400">
                                <Book :size="48" class="text-indigo-400 mb-2" />
                                <span class="fs-8 fw-semibold text-slate-500">{{ book?.tenSach }}</span>
                            </div>

                            <!-- Badge Status -->
                            <div class="position-absolute top-2 start-2">
                                <span 
                                    class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold shadow-xs"
                                    :class="book?.soQuyen > 0 ? 'badge-soft-emerald' : 'badge-soft-rose'"
                                >
                                    {{ book?.soQuyen > 0 ? `Còn ${book.soQuyen} quyển` : 'Hết sách' }}
                                </span>
                            </div>
                        </div>

                        <div class="mt-3 d-flex flex-column align-items-center gap-1">
                            <span class="badge badge-soft-indigo px-3 py-1.5 rounded-full fs-8">
                                {{ getCategoryName(book) }}
                            </span>

                            <div class="d-flex align-items-center gap-1 mt-1 text-amber-500 fs-7">
                                <Star v-for="star in 5" :key="star" :size="16" :class="{ 'fill-amber-400 text-amber-400': star <= Math.round(book?.diemTrungBinh || 5) }" />
                                <span class="fw-bold text-slate-800 ms-1">{{ (book?.diemTrungBinh || 5).toFixed(1) }}</span>
                                <span class="text-slate-400 fs-8">({{ book?.danhGia?.length || 0 }} đánh giá)</span>
                            </div>
                        </div>
                    </div>

                    <!-- Book Info Column -->
                    <div class="col-12 col-md-7">
                        <h4 class="fw-bold text-slate-900 mb-2 leading-tight">{{ book?.tenSach }}</h4>
                        
                        <div class="d-flex align-items-center gap-2 mb-3 text-slate-600 fs-7">
                            <User :size="16" class="text-indigo-600 flex-shrink-0" />
                            <span>Tác giả: <strong class="text-slate-900">{{ book?.tacGia }}</strong></span>
                        </div>

                        <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                            <div class="row g-2 fs-7">
                                <div class="col-6">
                                    <span class="text-slate-500 d-block fs-8">Nhà xuất bản</span>
                                    <strong class="text-slate-800">{{ getPublisherName(book) }}</strong>
                                </div>
                                <div class="col-6">
                                    <span class="text-slate-500 d-block fs-8">Năm xuất bản</span>
                                    <strong class="text-slate-800">{{ book?.namXuatBan || 'N/A' }}</strong>
                                </div>
                                <div class="col-6 mt-2">
                                    <span class="text-slate-500 d-block fs-8">Đơn giá lưu trữ</span>
                                    <strong class="text-indigo-600 fw-bold">{{ formatPrice(book?.donGia) }}</strong>
                                </div>
                                <div class="col-6 mt-2">
                                    <span class="text-slate-500 d-block fs-8">Lượt mượn</span>
                                    <strong class="text-emerald-600">{{ book?.luotMuon || 0 }} lượt</strong>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <h6 class="fs-8 fw-bold uppercase tracking-wider text-slate-400 mb-2">Mô Tả Tóm Tắt</h6>
                            <p class="text-slate-600 fs-7 leading-relaxed mb-0">
                                {{ book?.moTa || `Tác phẩm "${book?.tenSach}" của tác giả ${book?.tacGia} do ${getPublisherName(book)} phát hành năm ${book?.namXuatBan}. Đang có sẵn trong hệ thống kho thư viện để phục vụ tra cứu và mượn đọc.` }}
                            </p>
                        </div>

                        <!-- Add Review Section -->
                        <div class="border-top border-slate-200 pt-3">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <h6 class="fw-bold text-slate-900 fs-7 mb-0">Đánh Giá & Nhận Xét</h6>
                                <button type="button" class="btn btn-slate-light btn-sm fs-8 rounded-lg" @click="showReviewForm = !showReviewForm">
                                    <MessageSquare :size="14" class="d-inline me-1" />
                                    {{ showReviewForm ? 'Đóng' : 'Viết đánh giá' }}
                                </button>
                            </div>

                            <!-- Review Form -->
                            <div v-if="showReviewForm" class="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 mb-3">
                                <div class="mb-2">
                                    <label class="form-label fs-8 fw-bold text-slate-700 mb-1">Chọn số sao:</label>
                                    <div class="d-flex gap-1 text-amber-400">
                                        <Star 
                                            v-for="s in 5" 
                                            :key="s" 
                                            :size="20" 
                                            class="cursor-pointer" 
                                            :class="{ 'fill-amber-400': s <= newReview.diem }"
                                            @click="newReview.diem = s"
                                        />
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <input v-model="newReview.tenNguoiDanhGia" type="text" class="form-control form-control-sm rounded-lg" placeholder="Tên của bạn (Tùy chọn)" />
                                </div>
                                <div class="mb-2">
                                    <textarea v-model="newReview.nhanXet" class="form-control form-control-sm rounded-lg" rows="2" placeholder="Chia sẻ cảm nhận về cuốn sách..."></textarea>
                                </div>
                                <button type="button" class="btn btn-indigo btn-sm rounded-lg fs-8 fw-semibold" :disabled="isSubmittingReview" @click="submitReview">
                                    Gửi Đánh Giá
                                </button>
                            </div>

                            <!-- Review list -->
                            <div v-if="book?.danhGia?.length > 0" class="d-grid gap-2 max-h-160 overflow-y-auto">
                                <div v-for="(r, idx) in book.danhGia.slice().reverse()" :key="idx" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100 fs-8">
                                    <div class="d-flex align-items-center justify-content-between mb-1">
                                        <strong class="text-slate-800">{{ r.tenNguoiDanhGia || 'Độc giả vô danh' }}</strong>
                                        <div class="d-flex text-amber-400">
                                            <Star v-for="s in r.diem" :key="s" :size="12" class="fill-amber-400" />
                                        </div>
                                    </div>
                                    <p class="text-slate-600 mb-0">{{ r.nhanXet }}</p>
                                </div>
                            </div>
                            <div v-else class="fs-8 text-slate-400 italic">Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá!</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-3 px-4 bg-slate-50 border-top border-slate-100 d-flex align-items-center justify-content-between">
                <span class="text-slate-400 fs-8">Mã ISBN / Quản lý: <code class="text-slate-600">{{ book?.maSach }}</code></span>
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-slate-light px-4" @click="$emit('close')">
                        Đóng
                    </button>
                    <button 
                        type="button" 
                        class="btn btn-primary px-4 d-flex align-items-center gap-2"
                        :disabled="book?.soQuyen === 0"
                        @click="handleBorrowRequest"
                    >
                        <Bookmark :size="16" />
                        <span>Đăng Ký Mượn Trực Tuyến</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Online Borrow Modal -->
        <OnlineBorrowModal 
            :is-open="isOnlineModalOpen" 
            :book="book" 
            @close="isOnlineModalOpen = false" 
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import bookService from '../../services/book.service';
import { useToastStore } from '../../stores/toast.store';
import OnlineBorrowModal from '../OnlineBorrowModal.vue';
import { BookOpen, Book, X, User, Bookmark, Star, MessageSquare } from 'lucide-vue-next';

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    book: { type: Object, default: null }
});

const emit = defineEmits(['close']);
const toast = useToastStore();

const isOnlineModalOpen = ref(false);
const showReviewForm = ref(false);
const isSubmittingReview = ref(false);

const newReview = ref({
    diem: 5,
    tenNguoiDanhGia: '',
    nhanXet: ''
});

const getPublisherName = (b) => {
    if (!b) return 'N/A';
    if (typeof b.nhaXuatBan === 'object' && b.nhaXuatBan?.tenNXB) return b.nhaXuatBan.tenNXB;
    return b.nhaXuatBan || 'Chưa cập nhật';
};

const getCategoryName = (b) => {
    if (!b) return 'Tổng hợp';
    if (b.theLoai) return b.theLoai;
    return 'Khoa học & Nghệ thuật';
};

const formatPrice = (price) => {
    if (!price && price !== 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const handleImageError = (e) => {
    e.target.style.display = 'none';
};

const handleBorrowRequest = () => {
    isOnlineModalOpen.value = true;
};

const submitReview = async () => {
    if (!props.book?._id) return;
    isSubmittingReview.value = true;
    try {
        await bookService.addReview(props.book._id, newReview.value);
        toast.success('Cảm ơn bạn đã gửi đánh giá!');
        showReviewForm.value = false;
        newReview.value = { diem: 5, tenNguoiDanhGia: '', nhanXet: '' };
    } catch (error) {
        toast.error('Không thể gửi đánh giá.');
    } finally {
        isSubmittingReview.value = false;
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
.max-w-3xl { max-width: 780px; }
.btn-indigo { background-color: #4f46e5; color: white; }
.btn-indigo:hover { background-color: #4338ca; color: white; }
.fill-amber-400 { fill: #fbbf24; }
.text-amber-400 { color: #fbbf24; }
.max-h-160 { max-height: 160px; }
@keyframes pop {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.animate-pop { animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
