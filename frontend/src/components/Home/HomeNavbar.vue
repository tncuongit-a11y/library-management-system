<template>
    <header class="sticky-top bg-white/90 backdrop-blur-md border-bottom border-slate-200 z-100 transition-all">
        <div class="max-w-7xl mx-auto px-4 px-md-5">
            <div class="d-flex align-items-center justify-content-between py-3" style="min-height: 68px;">
                <!-- Brand Logo -->
                <router-link to="/" class="d-flex align-items-center gap-2.5 text-decoration-none">
                    <div class="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md d-flex align-items-center justify-content-center">
                        <Library :size="22" />
                    </div>
                    <div>
                        <div class="fw-extrabold fs-5 text-slate-900 tracking-tight leading-none mb-0.5">
                            Library<span class="text-indigo-600">Hub</span>
                        </div>
                        <span class="text-slate-500 fs-8 d-none d-sm-block">Thư Viện Tri Thức Số</span>
                    </div>
                </router-link>

                <!-- Navigation Links (Desktop) -->
                <nav class="d-none d-lg-flex align-items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <a href="#hero" class="nav-item-link active">Trang Chủ</a>
                    <a href="#search-section" class="nav-item-link">Tra Cứu Sách</a>
                    <a href="#featured-section" class="nav-item-link">Sách Nổi Bật</a>
                    <a href="#categories-section" class="nav-item-link">Thể Loại</a>
                    <a href="#stats-section" class="nav-item-link">Thống Kê</a>
                    <a href="#about-section" class="nav-item-link">Giới Thiệu</a>
                </nav>

                <!-- Right Actions -->
                <div class="d-flex align-items-center gap-2">
                    <button 
                        type="button" 
                        class="btn btn-outline-indigo px-3 py-2 rounded-xl fw-semibold fs-8 d-flex align-items-center gap-1.5"
                        @click="$emit('open-lookup')"
                    >
                        <Search :size="16" />
                        <span class="d-none d-sm-inline">Tra Cứu</span>
                    </button>

                    <!-- Staff Logged In -->
                    <template v-if="authStore.isAuthenticated && authStore.isStaff">
                        <router-link 
                            to="/dashboard" 
                            class="btn btn-primary px-3 py-2 rounded-xl fw-semibold d-flex align-items-center gap-2 shadow-xs hover-lift"
                        >
                            <LayoutDashboard :size="18" />
                            <span class="d-none d-sm-inline">Vào Dashboard</span>
                        </router-link>
                    </template>

                    <!-- Reader Logged In -->
                    <template v-else-if="authStore.isAuthenticated && authStore.isReader">
                        <router-link 
                            to="/reader-portal" 
                            class="btn btn-indigo px-3 py-2 rounded-xl fw-semibold d-flex align-items-center gap-2 shadow-xs hover-lift text-white text-decoration-none"
                        >
                            <UserCheck :size="18" />
                            <span class="d-none d-sm-inline">Cổng Độc Giả</span>
                        </router-link>
                    </template>

                    <!-- Not Logged In -->
                    <template v-else>
                        <button 
                            type="button"
                            class="btn btn-indigo text-white px-3 py-2 rounded-xl fw-semibold d-flex align-items-center gap-1.5 shadow-xs hover-lift fs-8"
                            @click="isReaderAuthOpen = true"
                        >
                            <UserPlus :size="16" />
                            <span>Độc Giả</span>
                        </button>
                        <router-link 
                            to="/login" 
                            class="btn btn-outline-slate px-3 py-2 rounded-xl fw-semibold d-flex align-items-center gap-1.5 fs-8"
                        >
                            <LogIn :size="16" />
                            <span class="d-none d-md-inline">Nhân Viên</span>
                        </router-link>
                    </template>

                    <!-- Mobile Menu Button -->
                    <button 
                        type="button" 
                        class="btn btn-slate-light p-2 rounded-xl d-lg-none"
                        @click="isMobileMenuOpen = !isMobileMenuOpen"
                        aria-label="Toggle menu"
                    >
                        <X v-if="isMobileMenuOpen" :size="22" />
                        <Menu v-else :size="22" />
                    </button>
                </div>
            </div>

            <!-- Mobile Navigation Drawer -->
            <div v-if="isMobileMenuOpen" class="d-lg-none py-3 border-top border-slate-100 animate-slide-down">
                <nav class="d-flex flex-column gap-1">
                    <a href="#hero" class="mobile-nav-link" @click="isMobileMenuOpen = false">Trang Chủ</a>
                    <a href="#search-section" class="mobile-nav-link" @click="isMobileMenuOpen = false">Tra Cứu Sách</a>
                    <a href="#featured-section" class="mobile-nav-link" @click="isMobileMenuOpen = false">Sách Nổi Bật</a>
                    <a href="#categories-section" class="mobile-nav-link" @click="isMobileMenuOpen = false">Thể Loại Phổ Biến</a>
                    <a href="#stats-section" class="mobile-nav-link" @click="isMobileMenuOpen = false">Thống Kê Nhanh</a>
                    <a href="#about-section" class="mobile-nav-link" @click="isMobileMenuOpen = false">Giới Thiệu Hệ Thống</a>
                </nav>
            </div>
        </div>

        <ReaderAuthModal :is-open="isReaderAuthOpen" @close="isReaderAuthOpen = false" />
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { Library, LayoutDashboard, LogIn, Menu, X, Search, UserCheck, UserPlus } from 'lucide-vue-next';
import ReaderAuthModal from '../ReaderAuthModal.vue';

const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);
const isReaderAuthOpen = ref(false);
</script>

<style scoped>
.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.max-w-7xl {
    max-width: 1280px;
}

.nav-item-link {
    color: #475569;
    font-size: 0.84rem;
    font-weight: 600;
    padding: 0.45rem 0.85rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.2s ease;
}

.nav-item-link:hover {
    color: #0f172a;
    background-color: #ffffff;
}

.nav-item-link.active {
    color: #4f46e5;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.mobile-nav-link {
    color: #334155;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    text-decoration: none;
}

.mobile-nav-link:hover {
    background-color: #f1f5f9;
    color: #4f46e5;
}

.hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
    transform: translateY(-1px);
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-slide-down {
    animation: slideDown 0.2s ease-out forwards;
}
</style>
