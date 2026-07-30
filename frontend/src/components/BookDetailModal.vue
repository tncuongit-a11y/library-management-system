<template>
    <transition name="modal-fade">
        <div v-if="isOpen && book" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3" @click.self="close">
            <div class="modal-card bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-100 max-w-2xl animate-scale">
                <!-- Modal Header -->
                <div class="d-flex align-items-center justify-content-between p-4 border-bottom border-slate-100 bg-slate-50/60">
                    <div class="d-flex align-items-center gap-2">
                        <span class="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <BookOpen :size="20" />
                        </span>
                        <div>
                            <h6 class="fw-bold text-slate-900 mb-0 fs-6">Chi Tiết Sách</h6>
                            <span class="text-slate-500 fs-7">Mã sách: {{ book.maSach }}</span>
                        </div>
                    </div>
                    <button type="button" class="btn-close text-slate-400 hover:text-slate-700" @click="close" aria-label="Close"></button>
                </div>

                <!-- Modal Body -->
                <div class="p-4 p-md-5">
                    <div class="row g-4 align-items-start">
                        <!-- Left: Book Cover -->
                        <div class="col-md-5 text-center">
                            <div class="mx-auto" style="max-width: 200px;">
                                <BookCover 
                                    :cover-url="book.hinhAnh" 
                                    :title="book.tenSach" 
                                    :author="book.tacGia" 
                                    :code="book.maSach" 
                                    height="280px"
                                    container-class="shadow-lg rounded-xl"
                                />
                            </div>
                            <div class="mt-3">
                                <span 
                                    class="badge px-3 py-1.5 rounded-full fs-7 fw-semibold"
                                    :class="book.soQuyen > 0 ? 'badge-soft-emerald' : 'badge-soft-rose'"
                                >
                                    <CheckCircle2 v-if="book.soQuyen > 0" :size="14" class="d-inline me-1" />
                                    <XCircle v-else :size="14" class="d-inline me-1" />
                                    {{ book.soQuyen > 0 ? `Còn ${book.soQuyen} quyển trong kho` : 'Hết sách' }}
                                </span>
                            </div>
                        </div>

                        <!-- Right: Details -->
                        <div class="col-md-7">
                            <h5 class="fw-bold text-slate-900 mb-2 leading-snug">{{ book.tenSach }}</h5>
                            <div class="text-slate-600 fs-7 mb-4 d-flex align-items-center gap-2">
                                <User :size="15" class="text-slate-400" />
                                <span class="fw-medium text-slate-800">{{ book.tacGia }}</span>
                            </div>

                            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="text-slate-400 fs-8 uppercase fw-semibold mb-0.5">Nhà xuất bản</div>
                                        <div class="fw-semibold text-slate-800 fs-7 d-flex align-items-center gap-1.5">
                                            <Building2 :size="14" class="text-indigo-600" />
                                            <span>{{ book.nhaXuatBan?.tenNXB || 'N/A' }}</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-slate-400 fs-8 uppercase fw-semibold mb-0.5">Năm xuất bản</div>
                                        <div class="fw-semibold text-slate-800 fs-7 d-flex align-items-center gap-1.5">
                                            <Calendar :size="14" class="text-indigo-600" />
                                            <span>{{ book.namXuatBan }}</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-slate-400 fs-8 uppercase fw-semibold mb-0.5">Giá mượn / Giá niêm yết</div>
                                        <div class="fw-bold text-indigo-600 fs-6">
                                            {{ book.donGia ? book.donGia.toLocaleString('vi-VN') + ' đ' : 'Miễn phí' }}
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-slate-400 fs-8 uppercase fw-semibold mb-0.5">Số lượng tồn kho</div>
                                        <div class="fw-bold text-slate-800 fs-6">
                                            {{ book.soQuyen }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex align-items-center justify-content-end gap-2 pt-2 border-top border-slate-100">
                                <router-link 
                                    :to="`/books/edit/${book._id}`" 
                                    class="btn btn-slate-light btn-sm px-3 rounded-lg fw-medium d-flex align-items-center gap-1.5"
                                    @click="close"
                                >
                                    <Pencil :size="15" />
                                    <span>Chỉnh sửa</span>
                                </router-link>
                                <router-link 
                                    v-if="book.soQuyen > 0"
                                    :to="`/borrows/add?bookId=${book._id}`" 
                                    class="btn btn-primary btn-sm px-3 rounded-lg fw-medium d-flex align-items-center gap-1.5"
                                    @click="close"
                                >
                                    <ArrowLeftRight :size="15" />
                                    <span>Lập phiếu mượn</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import BookCover from './BookCover.vue';
import { BookOpen, User, Building2, Calendar, CheckCircle2, XCircle, Pencil, ArrowLeftRight } from 'lucide-vue-next';

defineProps({
    isOpen: { type: Boolean, default: false },
    book: { type: Object, default: null }
});

const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<style scoped>
.modal-backdrop-custom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1080;
}

.modal-card {
    max-width: 620px;
}

.bg-indigo-50 { background-color: #eef2ff; }
.text-indigo-600 { color: #4f46e5; }
.border-indigo-100 { border-color: #e0e7ff; }

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.animate-scale {
    animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
    from {
        opacity: 0;
        transform: scale(0.96);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
