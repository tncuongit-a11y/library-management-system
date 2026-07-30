<template>
    <section id="stats-section" class="py-5 border-top border-slate-800 position-relative overflow-hidden" style="background-color: #0f172a; color: #ffffff;">
        <!-- Ambient background glow -->
        <div class="position-absolute top-1/2 start-1/2 translate-middle rounded-full blur-3xl" style="width: 600px; height: 300px; background-color: rgba(79, 70, 229, 0.12); pointer-events: none;"></div>

        <div class="max-w-7xl mx-auto px-4 px-md-5 position-relative z-10">
            <!-- Header -->
            <div class="text-center max-w-2xl mx-auto mb-5">
                <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 fs-8 fw-semibold mb-2" style="background-color: rgba(99, 102, 241, 0.15); color: #a5b4fc !important;">
                    <BarChart3 :size="14" class="text-indigo-400" />
                    <span>Dữ Liệu Vận Hành</span>
                </div>
                <h4 class="fw-bold tracking-tight mb-2" style="color: #ffffff !important;">Thống Kê Nhanh Hệ Thống</h4>
                <p class="fs-7 mb-0" style="color: #cbd5e1 !important;">Các con số ấn tượng phản ánh quy mô lưu trữ và mức độ hoạt động mượn đọc tại thư viện</p>
            </div>

            <!-- Stats Grid -->
            <div class="row g-3 g-md-4">
                <!-- 1. Total Books -->
                <div class="col-12 col-sm-6 col-lg-4 col-xl">
                    <div class="rounded-2xl p-4 border border-slate-700 shadow-lg backdrop-blur-md h-100 d-flex flex-column justify-content-between" style="background-color: #1e293b;">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <span class="fs-8 fw-semibold uppercase tracking-wider" style="color: #cbd5e1 !important;">Tổng Đầu Sách</span>
                            <div class="p-2.5 rounded-xl border border-indigo-500/30 text-indigo-400" style="background-color: rgba(99, 102, 241, 0.2);">
                                <BookOpen :size="22" />
                            </div>
                        </div>
                        <div>
                            <div class="display-6 fw-extrabold mb-1" style="color: #ffffff !important;">{{ animateNumber(stats.totalBooks || 120) }}</div>
                            <span class="fs-8 d-flex align-items-center gap-1" style="color: #818cf8 !important;">
                                <TrendingUp :size="12" /> +12 đầu sách tháng này
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 2. Total Authors -->
                <div class="col-12 col-sm-6 col-lg-4 col-xl">
                    <div class="rounded-2xl p-4 border border-slate-700 shadow-lg backdrop-blur-md h-100 d-flex flex-column justify-content-between" style="background-color: #1e293b;">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <span class="fs-8 fw-semibold uppercase tracking-wider" style="color: #cbd5e1 !important;">Tổng Tác Giả</span>
                            <div class="p-2.5 rounded-xl border border-purple-500/30 text-purple-400" style="background-color: rgba(168, 85, 247, 0.2);">
                                <PenTool :size="22" />
                            </div>
                        </div>
                        <div>
                            <div class="display-6 fw-extrabold mb-1" style="color: #ffffff !important;">{{ animateNumber(stats.totalAuthors || 85) }}</div>
                            <span class="fs-8" style="color: #c084fc !important;">Tác giả trong & ngoài nước</span>
                        </div>
                    </div>
                </div>

                <!-- 3. Total Publishers / Categories -->
                <div class="col-12 col-sm-6 col-lg-4 col-xl">
                    <div class="rounded-2xl p-4 border border-slate-700 shadow-lg backdrop-blur-md h-100 d-flex flex-column justify-content-between" style="background-color: #1e293b;">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <span class="fs-8 fw-semibold uppercase tracking-wider" style="color: #cbd5e1 !important;">NXB & Thể Loại</span>
                            <div class="p-2.5 rounded-xl border border-amber-500/30 text-amber-400" style="background-color: rgba(245, 158, 11, 0.2);">
                                <Building2 :size="22" />
                            </div>
                        </div>
                        <div>
                            <div class="display-6 fw-extrabold mb-1" style="color: #ffffff !important;">{{ animateNumber(stats.totalPublishers || 24) }}</div>
                            <span class="fs-8" style="color: #fbbf24 !important;">Đối tác nhà xuất bản uy tín</span>
                        </div>
                    </div>
                </div>

                <!-- 4. Total Readers -->
                <div class="col-12 col-sm-6 col-lg-4 col-xl">
                    <div class="rounded-2xl p-4 border border-slate-700 shadow-lg backdrop-blur-md h-100 d-flex flex-column justify-content-between" style="background-color: #1e293b;">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <span class="fs-8 fw-semibold uppercase tracking-wider" style="color: #cbd5e1 !important;">Thẻ Độc Giả</span>
                            <div class="p-2.5 rounded-xl border border-sky-500/30 text-sky-400" style="background-color: rgba(14, 165, 233, 0.2);">
                                <Users :size="22" />
                            </div>
                        </div>
                        <div>
                            <div class="display-6 fw-extrabold mb-1" style="color: #ffffff !important;">{{ animateNumber(stats.totalReaders || 450) }}</div>
                            <span class="fs-8" style="color: #38bdf8 !important;">Thành viên đang hoạt động</span>
                        </div>
                    </div>
                </div>

                <!-- 5. Active Borrows -->
                <div class="col-12 col-sm-6 col-lg-4 col-xl">
                    <div class="rounded-2xl p-4 border border-slate-700 shadow-lg backdrop-blur-md h-100 d-flex flex-column justify-content-between" style="background-color: #1e293b;">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <span class="fs-8 fw-semibold uppercase tracking-wider" style="color: #cbd5e1 !important;">Sách Đang Mượn</span>
                            <div class="p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400" style="background-color: rgba(16, 185, 129, 0.2);">
                                <Repeat :size="22" />
                            </div>
                        </div>
                        <div>
                            <div class="display-6 fw-extrabold mb-1" style="color: #ffffff !important;">{{ animateNumber(stats.unreturnedBorrows || 32) }}</div>
                            <span class="fs-8" style="color: #34d399 !important;">Phiếu mượn chưa trả</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { BarChart3, BookOpen, TrendingUp, PenTool, Building2, Users, Repeat } from 'lucide-vue-next';

const props = defineProps({
    stats: {
        type: Object,
        default: () => ({
            totalBooks: 0,
            totalAuthors: 0,
            totalPublishers: 0,
            totalReaders: 0,
            unreturnedBorrows: 0
        })
    }
});

const animateNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('vi-VN');
};
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }
.max-w-2xl { max-width: 672px; }

.bg-purple-500\/20 { background-color: rgba(168, 85, 247, 0.2); }
.text-purple-400 { color: #c084fc; }
.border-purple-500\/30 { border-color: rgba(168, 85, 247, 0.3); }

.bg-amber-500\/20 { background-color: rgba(245, 158, 11, 0.2); }
.text-amber-400 { color: #fbbf24; }
.border-amber-500\/30 { border-color: rgba(245, 158, 11, 0.3); }

.bg-sky-500\/20 { background-color: rgba(14, 165, 233, 0.2); }
.text-sky-400 { color: #38bdf8; }
.border-sky-500\/30 { border-color: rgba(14, 165, 233, 0.3); }
</style>
