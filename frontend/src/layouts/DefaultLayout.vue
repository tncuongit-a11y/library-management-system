<template>
    <div class="d-flex min-vh-100 bg-slate-50 text-slate-800 font-sans">
        <!-- Toast Notification Container -->
        <ToastNotification />

        <!-- Sidebar (Desktop & Mobile Drawer) -->
        <aside
            class="sidebar bg-slate-900 text-slate-300 d-flex flex-column transition-all border-end border-slate-800 shadow-lg"
            :class="{ 'sidebar-collapsed': isCollapsed, 'sidebar-mobile-show': isMobileOpen }">
            <!-- Sidebar Header / Brand -->
            <div class="d-flex align-items-center justify-content-between p-3 border-bottom border-slate-800"
                style="height: 64px;">
                <router-link to="/dashboard"
                    class="d-flex align-items-center gap-2.5 text-decoration-none text-white overflow-hidden">
                    <div
                        class="p-2 bg-indigo-600 rounded-lg text-white shadow-sm d-flex align-items-center justify-content-center">
                        <Library :size="20" />
                    </div>
                    <div v-if="!isCollapsed" class="fw-bold fs-6 text-nowrap tracking-tight">
                        <!-- Library<span class="text-indigo-400">QL mượn sách</span> -->
                    </div>
                </router-link>

                <button type="button" class="btn btn-sm text-slate-400 hover:text-white p-1 rounded-md d-none d-lg-flex"
                    @click="isCollapsed = !isCollapsed" title="Thu gọn Menu">
                    <PanelLeftClose v-if="!isCollapsed" :size="18" />
                    <PanelLeftOpen v-else :size="18" />
                </button>

                <button type="button" class="btn btn-sm text-slate-400 hover:text-white p-1 rounded-md d-lg-none"
                    @click="isMobileOpen = false">
                    <X :size="20" />
                </button>
            </div>

            <!-- Navigation Links -->
            <div class="p-3 flex-grow-1 overflow-y-auto">
                <!-- <div v-if="!isCollapsed" class="text-slate-500 fs-8 fw-semibold uppercase tracking-wider mb-2 px-2">
                    Giao Diện Công Cộng
                </div> -->
                <!-- <ul class="nav flex-column gap-1 mb-3">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link-custom">
                            <Globe :size="18" />
                            <span v-if="!isCollapsed" class="ms-2.5">Trang Chủ Tra Cứu</span>
                        </router-link>
                    </li>
                </ul> -->

                <div v-if="!isCollapsed" class="text-slate-500 fs-8 fw-semibold uppercase tracking-wider mb-2 px-2">
                    Menu Quản Trị
                </div>
                <ul class="nav flex-column gap-1">
                    <li class="nav-item">
                        <router-link to="/dashboard" class="nav-link-custom" active-class="active">
                            <LayoutDashboard :size="18" />
                            <span v-if="!isCollapsed" class="ms-2.5">Dashboard</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/books" class="nav-link-custom" active-class="active">
                            <BookOpen :size="18" />
                            <span v-if="!isCollapsed" class="ms-2.5">Quản lý Sách</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/publishers" class="nav-link-custom" active-class="active">
                            <Building2 :size="18" />
                            <span v-if="!isCollapsed" class="ms-2.5">Nhà xuất bản</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/readers" class="nav-link-custom" active-class="active">
                            <Users :size="18" />
                            <span v-if="!isCollapsed" class="ms-2.5">Độc giả</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/borrows" class="nav-link-custom" active-class="active">
                            <Repeat :size="18" />
                            <span v-if="!isCollapsed" class="ms-2.5">Mượn - Trả sách</span>
                        </router-link>
                    </li>

                    <li v-if="authStore.user?.chucVu === 'Quản lý'" class="nav-item mt-3">
                        <div v-if="!isCollapsed"
                            class="text-slate-500 fs-8 fw-semibold uppercase tracking-wider mb-2 px-2">
                            Quản trị
                        </div>
                        <router-link to="/staffs" class="nav-link-custom" active-class="active">
                            <ShieldCheck :size="18" />
                            <span v-if="!isCollapsed" class="ms-2.5">Nhân viên</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Sidebar User Profile Footer -->
            <div class="p-3 border-top border-slate-800 bg-slate-950/40">
                <div class="d-flex align-items-center gap-2.5">
                    <div class="rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 fw-bold d-flex align-items-center justify-content-center text-uppercase fs-7"
                        style="width: 36px; height: 36px; min-width: 36px;">
                        {{ getUserInitials(authStore.user?.hoTen) }}
                    </div>
                    <div v-if="!isCollapsed" class="overflow-hidden">
                        <div class="fw-semibold text-white fs-7 text-truncate mb-0.5">{{ authStore.user?.hoTen || 'User'
                        }}</div>
                        <div class="text-slate-400 fs-8 d-flex align-items-center gap-1">
                            <span class="d-inline-block rounded-full bg-emerald-500"
                                style="width: 6px; height: 6px;"></span>
                            <span>{{ authStore.user?.chucVu || 'Staff' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Wrapper -->
        <div class="flex-grow-1 d-flex flex-column min-w-0">
            <!-- Navbar Header -->
            <header
                class="bg-white border-bottom border-slate-200 px-4 d-flex align-items-center justify-content-between shadow-xs sticky-top"
                style="height: 64px;">
                <div class="d-flex align-items-center gap-3">
                    <button type="button" class="btn btn-sm btn-slate-light p-2 rounded-lg d-lg-none text-slate-700"
                        @click="isMobileOpen = !isMobileOpen">
                        <Menu :size="20" />
                    </button>
                    <div>
                        <h1 class="h6 mb-0 fw-bold text-slate-900 tracking-tight">{{ currentRouteTitle }}</h1>
                    </div>
                </div>

                <!-- Right Header Actions -->
                <div class="d-flex align-items-center gap-3">
                    <router-link to="/"
                        class="btn btn-slate-light btn-sm rounded-lg d-none d-sm-flex align-items-center gap-1.5 text-slate-700 fw-medium">
                        <Globe :size="16" />
                        <span>Trang chủ</span>
                    </router-link>

                    <!-- <div
                        class="d-none d-md-flex align-items-center px-3 py-1.5 bg-slate-100 rounded-lg text-slate-500 fs-7 border border-slate-200">
                        <span class="d-inline-block rounded-circle bg-emerald-500 me-2"
                            style="width: 8px; height: 8px;"></span>
                        <span>Hệ thống trực tuyến</span>
                    </div> -->

                    <div class="vr bg-slate-200 d-none d-md-block" style="height: 24px;"></div>

                    <button type="button"
                        class="btn btn-outline-slate btn-sm rounded-lg d-flex align-items-center gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                        @click="handleLogout">
                        <LogOut :size="16" />
                        <span class="d-none d-sm-inline">Đăng xuất</span>
                    </button>
                </div>
            </header>

            <!-- Page Content Body -->
            <main class="flex-grow-1 p-4 p-md-5 overflow-y-auto">
                <div class="max-w-7xl mx-auto">
                    <router-view></router-view>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRoute, useRouter } from 'vue-router';
import ToastNotification from '../components/ToastNotification.vue';
import {
    Library,
    Globe,
    LayoutDashboard,
    BookOpen,
    Building2,
    Users,
    Repeat,
    ShieldCheck,
    PanelLeftClose,
    PanelLeftOpen,
    X,
    Menu,
    LogOut
} from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isCollapsed = ref(false);
const isMobileOpen = ref(false);

const currentRouteTitle = computed(() => {
    switch (route.name) {
        case 'Dashboard': return 'Tổng Quan Hệ Thống';
        case 'BookList': return 'Quản Lý Sách';
        case 'BookAdd': return 'Thêm Sách Mới';
        case 'BookEdit': return 'Chỉnh Sửa Sách';
        case 'PublisherList': return 'Quản Lý Nhà Xuất Bản';
        case 'PublisherAdd': return 'Thêm Nhà Xuất Bản';
        case 'PublisherEdit': return 'Chỉnh Sửa Nhà Xuất Bản';
        case 'ReaderList': return 'Quản Lý Độc Giả';
        case 'ReaderAdd': return 'Thêm Độc Giả Mới';
        case 'ReaderEdit': return 'Chỉnh Sửa Độc Giả';
        case 'BorrowList': return 'Quản Lý Mượn - Trả Sách';
        case 'BorrowAdd': return 'Lập Phiếu Mượn Sách';
        case 'StaffList': return 'Quản Lý Nhân Viên';
        case 'StaffAdd': return 'Thêm Nhân Viên Mới';
        case 'StaffEdit': return 'Chỉnh Sửa Nhân Viên';
        default: return 'Quản Lý Thư Viện';
    }
});

const getUserInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const handleLogout = () => {
    authStore.logout();
    router.push({ name: 'Login' });
};
</script>

<style scoped>
.sidebar {
    width: 250px;
    min-width: 250px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1040;
}

.sidebar-collapsed {
    width: 72px;
    min-width: 72px;
}

.nav-link-custom {
    display: flex;
    align-items: center;
    padding: 0.625rem 0.75rem;
    color: #94a3b8;
    border-radius: 0.5rem;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.15s ease-in-out;
}

.nav-link-custom:hover {
    color: #ffffff;
    background-color: #1e293b;
}

/* .nav-link-custom.active {
    color: #ffffff;
    background-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
} */

.bg-indigo-600 {
    background-color: #4f46e5;
}

.text-indigo-400 {
    color: #818cf8;
}

.hover-bg-slate-800:hover {
    background-color: #1e293b;
}

.max-w-7xl {
    max-width: 1280px;
}

@media (max-width: 991.98px) {
    .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: -260px;
    }

    .sidebar-mobile-show {
        left: 0 !important;
    }
}
</style>
