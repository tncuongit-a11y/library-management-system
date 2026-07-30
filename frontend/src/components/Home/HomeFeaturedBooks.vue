<template>
    <section id="featured-section" class="py-5 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 px-md-5">
            <!-- Section Header -->
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                            <BookOpen :size="18" />
                        </div>
                        <h4 class="fw-bold text-slate-900 tracking-tight mb-0">Danh Mục Sách Nổi Bật</h4>
                    </div>
                    <p class="text-slate-500 fs-7 mb-0">Tuyển tập những đầu sách chất lượng, được mượn nhiều nhất trong hệ thống thư viện</p>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <span class="badge badge-soft-indigo fs-7 px-3 py-1.5 rounded-full">
                        Hiển thị {{ books.length }} đầu sách
                    </span>
                </div>
            </div>

            <!-- Skeleton Loading -->
            <div v-if="loading" class="row g-4">
                <div v-for="i in 8" :key="i" class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <div class="bg-white rounded-2xl border border-slate-200 p-3 h-100 shadow-xs">
                        <Skeleton height="220px" customClass="rounded-xl mb-3" />
                        <Skeleton height="18px" customClass="mb-2 w-75" />
                        <Skeleton height="14px" customClass="mb-3 w-50" />
                        <Skeleton height="36px" customClass="rounded-lg" />
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="books.length === 0" class="bg-white rounded-3xl p-5 text-center border border-slate-200 shadow-xs my-4">
                <div class="d-inline-flex p-3 bg-slate-100 text-slate-400 rounded-2xl mb-3">
                    <BookX :size="40" />
                </div>
                <h5 class="fw-bold text-slate-800 mb-1">Không tìm thấy sách phù hợp</h5>
                <p class="text-slate-500 fs-7 max-w-md mx-auto mb-3">Vui lòng thử tìm kiếm lại với từ khóa khác hoặc bỏ các bộ lọc thể loại.</p>
                <button type="button" class="btn btn-slate-light px-4 py-2" @click="$emit('reset-filters')">
                    Xóa Bộ Lọc Tìm Kiếm
                </button>
            </div>

            <!-- Books Grid -->
            <div v-else class="row g-4">
                <div 
                    v-for="book in books" 
                    :key="book._id || book.maSach" 
                    class="col-12 col-sm-6 col-lg-4 col-xl-3"
                >
                    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs shadow-hover h-100 d-flex flex-column transition-all">
                        <!-- Book Cover Image Section -->
                        <div class="position-relative bg-slate-100 overflow-hidden d-flex align-items-center justify-content-center p-3" style="height: 230px;">
                            <img 
                                v-if="book.hinhAnh" 
                                :src="book.hinhAnh" 
                                :alt="book.tenSach" 
                                class="w-100 h-100 object-fit-cover rounded-lg shadow-sm transition-transform hover-scale"
                                @error="handleImageError"
                            />
                            <div v-else class="w-100 h-100 rounded-xl bg-gradient-to-br from-slate-800 to-indigo-950 p-3 d-flex flex-column justify-content-between text-white border border-slate-700/50 shadow-inner">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fs-8 fw-bold uppercase tracking-wider text-indigo-300">{{ getPublisherName(book) }}</span>
                                    <Book :size="20" class="text-indigo-400" />
                                </div>
                                <div>
                                    <div class="fw-bold fs-7 leading-snug line-clamp-2 text-white mb-1">{{ book.tenSach }}</div>
                                    <div class="text-slate-300 fs-8">{{ book.tacGia }}</div>
                                </div>
                                <div class="fs-8 text-slate-400 font-mono">ISBN: {{ book.maSach }}</div>
                            </div>

                            <!-- Availability Badge -->
                            <div class="position-absolute top-3 start-3">
                                <span 
                                    class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold shadow-xs"
                                    :class="book.soQuyen > 0 ? 'badge-soft-emerald' : 'badge-soft-rose'"
                                >
                                    {{ book.soQuyen > 0 ? `Còn ${book.soQuyen} quyển` : 'Đã hết' }}
                                </span>
                            </div>

                            <!-- Category Badge -->
                            <div class="position-absolute bottom-3 end-3">
                                <span class="badge bg-slate-900/80 text-slate-200 backdrop-blur-md px-2.5 py-1 rounded-lg fs-8">
                                    {{ getCategoryName(book) }}
                                </span>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-3.5 p-md-4 d-flex flex-column flex-grow-1">
                            <div class="mb-2">
                                <h6 class="fw-bold text-slate-900 fs-6 line-clamp-2 mb-1 title-hover" :title="book.tenSach">
                                    {{ book.tenSach }}
                                </h6>
                                <div class="text-slate-500 fs-7 d-flex align-items-center gap-1.5">
                                    <User :size="14" class="text-slate-400 flex-shrink-0" />
                                    <span class="text-truncate">{{ book.tacGia }}</span>
                                </div>
                            </div>

                            <!-- Publisher & Year -->
                            <div class="mt-auto pt-3 border-top border-slate-100 fs-8 text-slate-500 d-flex align-items-center justify-content-between mb-3">
                                <span class="text-truncate max-w-150"><Building2 :size="13" class="d-inline me-1 text-slate-400" />{{ getPublisherName(book) }}</span>
                                <span class="fw-medium text-slate-700">{{ book.namXuatBan || 'N/A' }}</span>
                            </div>

                            <!-- Action Button -->
                            <button 
                                type="button" 
                                class="btn btn-outline-slate w-100 py-2 rounded-xl fw-semibold fs-7 d-flex align-items-center justify-content-center gap-2 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
                                @click="$emit('select-book', book)"
                            >
                                <Eye :size="16" />
                                <span>Xem Chi Tiết</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import Skeleton from '../Skeleton.vue';
import { BookOpen, BookX, Book, User, Building2, Eye } from 'lucide-vue-next';

const props = defineProps({
    books: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
});

const emit = defineEmits(['select-book', 'reset-filters']);

const getPublisherName = (b) => {
    if (!b) return 'NXB';
    if (typeof b.nhaXuatBan === 'object' && b.nhaXuatBan?.tenNXB) return b.nhaXuatBan.tenNXB;
    return b.nhaXuatBan || 'NXB';
};

const getCategoryName = (b) => {
    if (!b) return 'General';
    if (b.theLoai) return b.theLoai;
    return 'Khoa học & Kỹ thuật';
};

const handleImageError = (e) => {
    e.target.style.display = 'none';
};
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }
.max-w-md { max-width: 440px; }
.max-w-150 { max-width: 150px; }

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.hover-scale {
    transition: transform 0.3s ease;
}
.hover-scale:hover {
    transform: scale(1.03);
}

.title-hover:hover {
    color: #4f46e5 !important;
}
</style>
