<template>
    <div class="min-vh-100 bg-slate-50 text-slate-800 d-flex flex-column">
        <!-- Toast -->
        <ToastNotification />

        <!-- Header -->
        <HomeNavbar @open-lookup="isLookupOpen = true" />

        <!-- Reader Main Dashboard Container -->
        <main class="flex-grow-1 py-5 px-3 px-md-4">
            <div class="container max-w-5xl">
                <!-- Top Greeting Card -->
                <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 p-md-5 rounded-2xl shadow-xl mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                            <UserCheck :size="36" class="text-indigo-200" />
                        </div>
                        <div>
                            <span class="badge bg-indigo-500/30 text-indigo-100 px-3 py-1 rounded-full fs-8 mb-1">Cổng Thông Tin Độc Giả</span>
                            <h3 class="fw-bold mb-1">{{ authStore.user?.hoTen || 'Độc giả Thư viện' }}</h3>
                            <div class="fs-8 text-indigo-100 d-flex flex-wrap gap-3">
                                <span>Mã ĐG: <strong class="text-white fw-mono">{{ authStore.user?.maDocGia }}</strong></span>
                                <span>SĐT: <strong class="text-white">{{ authStore.user?.dienThoai }}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <router-link to="/" class="btn btn-white/10 text-white hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl fs-8 fw-semibold text-decoration-none">
                            <BookOpen :size="16" class="d-inline me-1" />
                            <span>Khám Phá Khai Thác Sách</span>
                        </router-link>
                        <button type="button" class="btn btn-rose-500/20 text-rose-200 hover:bg-rose-500/30 border border-rose-400/30 px-3 py-2 rounded-xl fs-8 fw-semibold" @click="handleLogout">
                            <LogOut :size="16" />
                        </button>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="row g-4">
                    <!-- Stat Highlights -->
                    <div class="col-12 col-md-4">
                        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-4">
                            <h6 class="fw-bold text-slate-900 mb-3 fs-7">Tổng Quan Phiếu Mượn</h6>
                            <div class="d-grid gap-3">
                                <div class="d-flex align-items-center justify-content-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div class="d-flex align-items-center gap-2">
                                        <Clock :size="18" class="text-indigo-600" />
                                        <span class="fs-8 text-slate-700 fw-medium">Đang giữ mượn</span>
                                    </div>
                                    <span class="fw-bold text-indigo-700 fs-6">{{ activeBorrows.length }}</span>
                                </div>

                                <div class="d-flex align-items-center justify-content-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                                    <div class="d-flex align-items-center gap-2">
                                        <Hourglass :size="18" class="text-amber-600" />
                                        <span class="fs-8 text-slate-700 fw-medium">Chờ duyệt online</span>
                                    </div>
                                    <span class="fw-bold text-amber-700 fs-6">{{ pendingBorrows.length }}</span>
                                </div>

                                <div class="d-flex align-items-center justify-content-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div class="d-flex align-items-center gap-2">
                                        <CheckCircle2 :size="18" class="text-emerald-600" />
                                        <span class="fs-8 text-slate-700 fw-medium">Đã trả xong</span>
                                    </div>
                                    <span class="fw-bold text-emerald-700 fs-6">{{ returnedBorrows.length }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Personal Info Card -->
                        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                            <h6 class="fw-bold text-slate-900 mb-3 fs-7">Hồ Sơ Độc Giả</h6>
                            <div class="fs-8 text-slate-600 d-grid gap-2.5">
                                <div>
                                    <span class="text-slate-400 d-block">Mã Độc Giả</span>
                                    <strong class="text-slate-900 fw-mono">{{ authStore.user?.maDocGia }}</strong>
                                </div>
                                <div>
                                    <span class="text-slate-400 d-block">Họ và Tên</span>
                                    <strong class="text-slate-900">{{ authStore.user?.hoTen }}</strong>
                                </div>
                                <div>
                                    <span class="text-slate-400 d-block">Số điện thoại</span>
                                    <strong class="text-slate-900">{{ authStore.user?.dienThoai }}</strong>
                                </div>
                                <div>
                                    <span class="text-slate-400 d-block">Địa chỉ đăng ký</span>
                                    <strong class="text-slate-900">{{ authStore.user?.diaChi || 'Đã đăng ký hệ thống' }}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Borrows & Activity List -->
                    <div class="col-12 col-md-8">
                        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-4">
                            <!-- Tabs -->
                            <div class="d-flex border-bottom border-slate-100 mb-4 gap-3">
                                <button 
                                    type="button" 
                                    class="pb-2 fs-7 fw-bold transition-all border-bottom-2"
                                    :class="tab === 'active' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-700'"
                                    @click="tab = 'active'"
                                >
                                    Đang Mượn & Chờ Duyệt ({{ activeBorrows.length + pendingBorrows.length }})
                                </button>
                                <button 
                                    type="button" 
                                    class="pb-2 fs-7 fw-bold transition-all border-bottom-2"
                                    :class="tab === 'history' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-700'"
                                    @click="tab = 'history'"
                                >
                                    Lịch Sử Đã Hoàn Trả ({{ returnedBorrows.length }})
                                </button>
                            </div>

                            <!-- Loading -->
                            <div v-if="isLoading" class="py-5 text-center">
                                <div class="spinner-border text-indigo-600"></div>
                                <p class="text-slate-400 fs-8 mt-2">Đang tải lịch sử mượn...</p>
                            </div>

                            <!-- ACTIVE & PENDING BORROWS -->
                            <div v-else-if="tab === 'active'">
                                <div v-if="activeBorrows.length === 0 && pendingBorrows.length === 0" class="py-5 text-center text-slate-400">
                                    <BookOpen :size="40" class="mb-2 text-slate-300" />
                                    <p class="fs-7 mb-2">Bạn hiện không có cuốn sách nào đang mượn.</p>
                                    <router-link to="/" class="btn btn-indigo btn-sm rounded-lg px-3">
                                        Tìm Sách Để Mượn Ngay
                                    </router-link>
                                </div>

                                <div v-else class="d-grid gap-3">
                                    <!-- Pending Requests -->
                                    <div v-for="b in pendingBorrows" :key="b._id" class="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
                                        <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                                            <div>
                                                <h6 class="fw-bold text-slate-900 fs-7 mb-0">{{ b.sach?.tenSach || 'Sách' }}</h6>
                                                <span class="fs-8 text-slate-500">Tác giả: {{ b.sach?.tacGia }}</span>
                                            </div>
                                            <span class="badge badge-soft-amber px-2.5 py-1 rounded-full fs-8">Yêu Cầu Chờ Duyệt</span>
                                        </div>
                                        <div class="fs-8 text-amber-800 bg-white/60 p-2 rounded-lg">
                                            Thủ thư đang chuẩn bị sách. Bạn sẽ nhận được thông báo khi sách sẵn sàng tại quầy.
                                        </div>
                                    </div>

                                    <!-- Active Loans -->
                                    <div v-for="b in activeBorrows" :key="b._id" class="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                                        <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                                            <div>
                                                <h6 class="fw-bold text-slate-900 fs-7 mb-0">{{ b.sach?.tenSach || 'Sách' }}</h6>
                                                <span class="fs-8 text-slate-500">Mã sách: <code class="text-indigo-600">{{ b.sach?.maSach }}</code></span>
                                            </div>
                                            <span class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold" :class="b.computedStatus === 'QUA_HAN' ? 'badge-soft-rose' : 'badge-soft-indigo'">
                                                {{ b.computedStatus === 'QUA_HAN' ? 'Cảnh báo quá hạn!' : 'Đang giữ mượn' }}
                                            </span>
                                        </div>

                                        <div class="row g-2 fs-8 bg-slate-50 p-2.5 rounded-lg my-2">
                                            <div class="col-6">
                                                <span class="text-slate-400">Ngày mượn: </span>
                                                <strong class="text-slate-800">{{ formatDate(b.ngayMuon) }}</strong>
                                            </div>
                                            <div class="col-6">
                                                <span class="text-slate-400">Hạn phải trả: </span>
                                                <strong :class="b.computedStatus === 'QUA_HAN' ? 'text-rose-600 fw-bold' : 'text-slate-800'">
                                                    {{ formatDate(b.ngayPhaiTra) }}
                                                </strong>
                                            </div>
                                            <div v-if="b.phiPhat > 0" class="col-12 text-rose-600 fw-bold">
                                                Phí phạt trễ hạn tính đến nay: {{ formatCurrency(b.phiPhat) }}
                                            </div>
                                        </div>

                                        <div class="d-flex align-items-center justify-content-between mt-2">
                                            <span class="fs-8 text-slate-400">Đã gia hạn: {{ b.soLanGiaHan || 0 }}/2 lần</span>
                                            <button 
                                                v-if="(b.soLanGiaHan || 0) < 2"
                                                type="button" 
                                                class="btn btn-outline-indigo btn-sm fs-8 rounded-lg d-inline-flex align-items-center gap-1"
                                                :disabled="extendingId === b._id"
                                                @click="handleExtend(b._id)"
                                            >
                                                <Clock :size="14" />
                                                <span>Gia hạn +7 ngày</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- HISTORY BORROWS -->
                            <div v-else>
                                <div v-if="returnedBorrows.length === 0" class="py-5 text-center text-slate-400 fs-7">
                                    Chưa có lịch sử mượn trả đã hoàn tất.
                                </div>
                                <div v-else class="d-grid gap-2">
                                    <div v-for="b in returnedBorrows" :key="b._id" class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 d-flex align-items-center justify-content-between">
                                        <div>
                                            <div class="fw-bold text-slate-800 fs-7">{{ b.sach?.tenSach || 'Sách' }}</div>
                                            <div class="fs-8 text-slate-400">Mượn từ {{ formatDate(b.ngayMuon) }} đến {{ formatDate(b.ngayTra) }}</div>
                                        </div>
                                        <span class="badge badge-soft-emerald px-2.5 py-1 rounded-full fs-8">Đã Trả Xong</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <HomeFooter />
        <ReaderLookupModal :is-open="isLookupOpen" @close="isLookupOpen = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useToastStore } from '../stores/toast.store';
import borrowService from '../services/borrow.service';

import ToastNotification from '../components/ToastNotification.vue';
import HomeNavbar from '../components/Home/HomeNavbar.vue';
import HomeFooter from '../components/Home/HomeFooter.vue';
import ReaderLookupModal from '../components/ReaderLookupModal.vue';
import { UserCheck, BookOpen, LogOut, Clock, Hourglass, CheckCircle2 } from 'lucide-vue-next';

const authStore = useAuthStore();
const toast = useToastStore();
const router = useRouter();

const tab = ref('active');
const isLoading = ref(false);
const borrows = ref([]);
const isLookupOpen = ref(false);
const extendingId = ref(null);

const fetchMyBorrows = async () => {
    if (!authStore.user?.dienThoai && !authStore.user?.maDocGia) return;
    isLoading.value = true;
    try {
        const query = authStore.user.maDocGia || authStore.user.dienThoai;
        const res = await borrowService.lookupReaderHistory(query);
        borrows.value = res.data?.borrows || [];
    } catch (error) {
        toast.error('Không thể tải lịch sử mượn sách cá nhân.');
    } finally {
        isLoading.value = false;
    }
};

const activeBorrows = computed(() => {
    return borrows.value.filter(b => b.computedStatus === 'DANG_MUON' || b.computedStatus === 'QUA_HAN');
});

const pendingBorrows = computed(() => {
    return borrows.value.filter(b => b.computedStatus === 'CHO_DUYET');
});

const returnedBorrows = computed(() => {
    return borrows.value.filter(b => b.computedStatus === 'DA_TRA');
});

const handleExtend = async (borrowId) => {
    extendingId.value = borrowId;
    try {
        await borrowService.extendBorrow(borrowId);
        toast.success('Gia hạn mượn sách thành công (+7 ngày)!');
        fetchMyBorrows();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể gia hạn.');
    } finally {
        extendingId.value = null;
    }
};

const handleLogout = () => {
    authStore.logout();
    toast.success('Đã đăng xuất khỏi cổng độc giả.');
    router.push({ name: 'Home' });
};

const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('vi-VN');
};

const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

onMounted(() => {
    if (!authStore.isAuthenticated || !authStore.isReader) {
        router.push({ name: 'Home' });
        return;
    }
    fetchMyBorrows();
});
</script>

<style scoped>
.max-w-5xl { max-width: 1040px; }
.btn-indigo { background-color: #4f46e5; color: white; }
.btn-indigo:hover { background-color: #4338ca; color: white; }
.btn-outline-indigo { color: #4f46e5; border-color: #c7d2fe; }
.btn-outline-indigo:hover { background-color: #4f46e5; color: white; }
.border-bottom-2 { border-bottom-width: 2px; }
</style>
