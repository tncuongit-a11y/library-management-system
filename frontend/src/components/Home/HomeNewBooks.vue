<template>
    <section id="new-books" class="py-5 bg-white border-top border-slate-200">
        <div class="max-w-7xl mx-auto px-4 px-md-5">
            <div class="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                            <Sparkles :size="18" />
                        </span>
                        <h4 class="fw-bold text-slate-900 tracking-tight mb-0">Sách Mới Cập Nhật</h4>
                    </div>
                    <p class="text-slate-500 fs-7 mb-0">Các đầu sách mới được nhập kho bổ sung vào bộ sưu tập thư viện</p>
                </div>

                <a href="#featured-section" class="btn btn-slate-light btn-sm rounded-lg d-none d-sm-flex align-items-center gap-1.5 fw-semibold text-slate-700">
                    <span>Xem tất cả</span>
                    <ArrowRight :size="16" />
                </a>
            </div>

            <!-- New Books Grid -->
            <div class="row g-3">
                <div 
                    v-for="book in newBooks" 
                    :key="book._id || book.maSach"
                    class="col-12 col-md-6 col-lg-4"
                >
                    <div 
                        class="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer d-flex gap-3 align-items-center"
                        @click="$emit('select-book', book)"
                    >
                        <!-- Book Cover Thumbnail -->
                        <div class="position-relative flex-shrink-0 bg-slate-900 rounded-xl overflow-hidden shadow-xs d-flex align-items-center justify-content-center text-white" style="width: 80px; height: 110px;">
                            <img 
                                v-if="book.hinhAnh" 
                                :src="book.hinhAnh" 
                                :alt="book.tenSach" 
                                class="w-100 h-100 object-fit-cover" 
                                @error="handleImageError"
                            />
                            <div v-else class="p-2 text-center">
                                <Book :size="24" class="text-indigo-400 mb-1" />
                                <span class="fs-8 fw-mono text-slate-300 d-block">{{ book.maSach }}</span>
                            </div>

                            <span class="position-absolute top-1 start-1 badge bg-rose-500 text-white fs-8 px-1.5 py-0.5 rounded-md">
                                Mới
                            </span>
                        </div>

                        <!-- Book Content -->
                        <div class="overflow-hidden flex-grow-1">
                            <span class="badge badge-soft-indigo fs-8 mb-1.5">
                                {{ getPublisherName(book) }}
                            </span>
                            <h6 class="fw-bold text-slate-900 fs-7 text-truncate mb-1" :title="book.tenSach">
                                {{ book.tenSach }}
                            </h6>
                            <div class="text-slate-500 fs-8 d-flex align-items-center gap-1 mb-2">
                                <User :size="13" class="text-slate-400" />
                                <span class="text-truncate">{{ book.tacGia }}</span>
                            </div>

                            <div class="d-flex align-items-center justify-content-between">
                                <span class="fs-8 fw-semibold text-indigo-600">
                                    {{ formatPrice(book.donGia) }}
                                </span>
                                <span class="fs-8 text-slate-500">
                                    Kho: <strong class="text-slate-800">{{ book.soQuyen }}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Sparkles, ArrowRight, Book, User } from 'lucide-vue-next';

const props = defineProps({
    newBooks: { type: Array, default: () => [] }
});

const emit = defineEmits(['select-book']);

const getPublisherName = (b) => {
    if (!b) return 'NXB';
    if (typeof b.nhaXuatBan === 'object' && b.nhaXuatBan?.tenNXB) return b.nhaXuatBan.tenNXB;
    return b.nhaXuatBan || 'NXB';
};

const formatPrice = (price) => {
    if (!price && price !== 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const handleImageError = (e) => {
    e.target.style.display = 'none';
};
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }
.cursor-pointer { cursor: pointer; }
.bg-rose-100 { background-color: #ffe4e6; }
.text-rose-600 { color: #e11d48; }
.bg-rose-500 { background-color: #f43f5e; }
</style>
