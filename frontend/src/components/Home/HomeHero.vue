<template>
    <section id="hero" class="position-relative overflow-hidden pt-5 pb-5 pb-lg-6 bg-slate-900 text-white border-bottom border-slate-800">
        <!-- Ambient background glows -->
        <div class="position-absolute top-0 start-50 translate-middle-x rounded-full bg-indigo-600/20 blur-3xl" style="width: 700px; height: 500px; pointer-events: none;"></div>
        <div class="position-absolute bottom-0 end-0 rounded-full bg-emerald-500/10 blur-3xl" style="width: 400px; height: 400px; pointer-events: none;"></div>

        <div class="max-w-7xl mx-auto px-4 px-md-5 position-relative z-10">
            <div class="row align-items-center g-5">
                <!-- Left Column: Text & CTAs -->
                <div class="col-12 col-lg-7 text-center text-lg-start">
                    <div class="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-full text-indigo-300 border border-indigo-500/30 fs-8 fw-semibold mb-4" style="background-color: rgba(99, 102, 241, 0.15);">
                        <Sparkles :size="14" class="text-indigo-400" />
                        <span class="text-indigo-200">Hệ Thống Quản Lý Thư Viện Doanh Nghiệp Hiện Đại</span>
                    </div>

                    <h1 class="display-5 fw-extrabold text-white tracking-tight leading-tight mb-3">
                        Khám Phá & Quản Lý <br class="d-none d-sm-inline" />
                        <span class="hero-gradient-text">
                            Tri Thức Không Giới Hạn
                        </span>
                    </h1>

                    <p class="fs-6 leading-relaxed mb-4 max-w-xl mx-auto mx-lg-0" style="color: #cbd5e1 !important;">
                        Nền tảng tra cứu, mượn trả và lưu trữ sách thông minh. Tối ưu hóa vận hành thư viện, nâng cao trải nghiệm học thuật và tìm kiếm tài liệu cho độc giả.
                    </p>

                    <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-lg-start gap-3 mb-4">
                        <a 
                            href="#search-section" 
                            class="btn btn-primary btn-lg px-4 py-3 rounded-xl fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg shadow-indigo-600/30 w-100 w-sm-auto"
                        >
                            <BookOpen :size="20" />
                            <span>Khám Phá Tủ Sách</span>
                            <ArrowRight :size="18" />
                        </a>

                        <router-link 
                            v-if="!authStore.isAuthenticated"
                            to="/login" 
                            class="btn btn-outline-light btn-lg px-4 py-3 rounded-xl fw-semibold d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto border-slate-700 hover:bg-white/10"
                        >
                            <LogIn :size="20" />
                            <span>Đăng Nhập Quản Trị</span>
                        </router-link>
                        <router-link 
                            v-else
                            to="/dashboard" 
                            class="btn btn-emerald btn-lg px-4 py-3 rounded-xl fw-semibold d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto shadow-md"
                        >
                            <LayoutDashboard :size="20" />
                            <span>Quản Lý Hệ Thống</span>
                        </router-link>
                    </div>

                    <!-- Quick Highlights -->
                    <div class="pt-3 d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-4 text-slate-400 fs-8 border-top border-slate-800/80">
                        <div class="d-flex align-items-center gap-2">
                            <CheckCircle2 :size="16" class="text-emerald-400" />
                            <span>Tra cứu tài liệu 24/7</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <CheckCircle2 :size="16" class="text-emerald-400" />
                            <span>Cập nhật sách tự động</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <CheckCircle2 :size="16" class="text-emerald-400" />
                            <span>Quản lý mượn trả tiện lợi</span>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Visual Artwork / Card Stack -->
                <div class="col-12 col-lg-5">
                    <div class="position-relative mx-auto max-w-md">
                        <!-- Background Glow -->
                        <div class="position-absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl blur-xl opacity-30"></div>

                        <!-- Main Library Showcase Card -->
                        <div class="position-relative rounded-3xl border border-slate-700 p-4 p-sm-5 shadow-2xl backdrop-blur-xl" style="background-color: rgba(30, 41, 59, 0.95);">
                            <!-- Visual Book Stack Header -->
                            <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-slate-700">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="p-3 rounded-2xl border border-indigo-500/30 text-indigo-400" style="background-color: rgba(79, 70, 229, 0.2);">
                                        <Library :size="28" />
                                    </div>
                                    <div>
                                        <h6 class="fw-bold text-white mb-0">Library Management</h6>
                                        <span class="fs-8" style="color: #94a3b8 !important;">Hệ thống thư viện thông minh</span>
                                    </div>
                                </div>
                                <span class="badge badge-soft-emerald px-2.5 py-1 rounded-full fs-8">Online</span>
                            </div>

                            <!-- Interactive Stat Preview Boxes -->
                            <div class="row g-3 mb-4">
                                <div class="col-6">
                                    <div class="p-3 rounded-2xl border border-slate-700" style="background-color: rgba(15, 23, 42, 0.9);">
                                        <div class="d-flex align-items-center gap-2 text-indigo-400 fs-8 fw-semibold mb-1">
                                            <BookOpen :size="16" />
                                            <span>Đầu Sách</span>
                                        </div>
                                        <div class="fs-4 fw-extrabold text-white">1,250+</div>
                                        <span class="fs-8" style="color: #94a3b8 !important;">Đa dạng thể loại</span>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 rounded-2xl border border-slate-700" style="background-color: rgba(15, 23, 42, 0.9);">
                                        <div class="d-flex align-items-center gap-2 text-emerald-400 fs-8 fw-semibold mb-1">
                                            <Users :size="16" />
                                            <span>Thành Viên</span>
                                        </div>
                                        <div class="fs-4 fw-extrabold text-white">3,800+</div>
                                        <span class="fs-8" style="color: #94a3b8 !important;">Độc giả đăng ký</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Featured Book Snippet -->
                            <div class="p-3 rounded-2xl border border-indigo-500/30 d-flex align-items-center gap-3" style="background-color: rgba(30, 27, 75, 0.6);">
                                <div class="p-2.5 bg-indigo-600 text-white rounded-xl flex-shrink-0">
                                    <BookmarkCheck :size="20" />
                                </div>
                                <div class="overflow-hidden">
                                    <div class="fs-8 fw-medium" style="color: #94a3b8 !important;">Sách gợi ý hôm nay</div>
                                    <div class="fw-bold text-white fs-7 text-truncate">Lập Trình Web Với Vue 3 & Node.js</div>
                                    <span class="fs-8" style="color: #a5b4fc !important;">Khoa học & Công nghệ</span>
                                </div>
                            </div>
                        </div>

                        <!-- Floating Badge 1 -->
                        <div class="position-absolute top-0 start-0 translate-middle-y bg-white text-slate-900 px-3 py-2 rounded-2xl shadow-xl border border-slate-200 d-none d-sm-flex align-items-center gap-2 z-2">
                            <span class="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                                <ShieldCheck :size="16" />
                            </span>
                            <span class="fs-8 fw-bold text-slate-900">Bảo mật chuẩn ISO</span>
                        </div>

                        <!-- Floating Badge 2 -->
                        <div class="position-absolute bottom-0 end-0 translate-middle-y bg-white text-slate-900 px-3 py-2 rounded-2xl shadow-xl border border-slate-200 d-none d-sm-flex align-items-center gap-2 z-2">
                            <span class="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                                <Search :size="16" />
                            </span>
                            <span class="fs-8 fw-bold text-slate-900">Tra cứu tức thì</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth.store';
import { 
    Sparkles, 
    BookOpen, 
    ArrowRight, 
    LogIn, 
    LayoutDashboard, 
    CheckCircle2, 
    Library, 
    Users, 
    BookmarkCheck, 
    ShieldCheck, 
    Search 
} from 'lucide-vue-next';

const authStore = useAuthStore();
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }
.max-w-xl { max-width: 576px; }
.max-w-md { max-width: 440px; }

.hero-gradient-text {
    background: linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    display: inline-block;
}

.shadow-indigo-600\/30 {
    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
}
</style>
