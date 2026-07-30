<template>
    <div>
        <!-- Page Header & Quick Actions -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold text-slate-900 tracking-tight mb-1">Báo Cáo & Thống Kê Tổng Quan</h4>
                <p class="text-slate-500 fs-7 mb-0">Theo dõi hoạt động mượn trả sách và hiệu suất vận hành thư viện realtime.</p>
            </div>
            
            <div class="d-flex align-items-center gap-2">
                <button 
                    type="button" 
                    class="btn btn-slate-light btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-medium text-slate-700" 
                    @click="refreshAll" 
                    :disabled="isLoading"
                >
                    <RefreshCw :size="16" :class="{ 'spin-animation': isLoading }" />
                    <span>Làm mới</span>
                </button>
                <router-link to="/borrows/add" class="btn btn-primary btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-medium shadow-xs">
                    <Plus :size="16" />
                    <span>Lập phiếu mượn</span>
                </router-link>
            </div>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="isLoading && !stats.totalBooks" class="row g-4 mb-5">
            <div v-for="i in 4" :key="i" class="col-12 col-sm-6 col-xl-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <Skeleton height="16px" width="40%" radius="4px" customClass="mb-3" />
                    <Skeleton height="32px" width="60%" radius="6px" customClass="mb-2" />
                    <Skeleton height="14px" width="80%" radius="4px" />
                </div>
            </div>
        </div>

        <!-- Metric Stat Cards -->
        <div v-else class="row g-4 mb-4">
            <!-- Metric 1: Books -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs shadow-hover transition-all">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <span class="text-slate-500 fs-7 fw-semibold">Tổng đầu sách</span>
                        <div class="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <BookOpen :size="20" />
                        </div>
                    </div>
                    <div class="d-flex align-items-baseline justify-content-between">
                        <h3 class="fw-bold text-slate-900 mb-0 tracking-tight">{{ stats.totalBooks || 0 }}</h3>
                        <span class="badge badge-soft-emerald fs-8 fw-semibold d-inline-flex align-items-center gap-1">
                            <TrendingUp :size="12" /> +8.4%
                        </span>
                    </div>
                    <div class="text-slate-500 fs-8 mt-2">Đã được phân loại trong kho</div>
                </div>
            </div>

            <!-- Metric 2: Readers -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs shadow-hover transition-all">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <span class="text-slate-500 fs-7 fw-semibold">Độc giả đăng ký</span>
                        <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Users :size="20" />
                        </div>
                    </div>
                    <div class="d-flex align-items-baseline justify-content-between">
                        <h3 class="fw-bold text-slate-900 mb-0 tracking-tight">{{ stats.totalReaders || 0 }}</h3>
                        <span class="badge badge-soft-emerald fs-8 fw-semibold d-inline-flex align-items-center gap-1">
                            <TrendingUp :size="12" /> +12%
                        </span>
                    </div>
                    <div class="text-slate-500 fs-8 mt-2">Thành viên có thẻ còn hiệu lực</div>
                </div>
            </div>

            <!-- Metric 3: Borrows -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs shadow-hover transition-all">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <span class="text-slate-500 fs-7 fw-semibold">Tổng lượt mượn</span>
                        <div class="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Repeat :size="20" />
                        </div>
                    </div>
                    <div class="d-flex align-items-baseline justify-content-between">
                        <h3 class="fw-bold text-slate-900 mb-0 tracking-tight">{{ stats.totalBorrows || 0 }}</h3>
                        <span class="badge badge-soft-indigo fs-8 fw-semibold d-inline-flex align-items-center gap-1">
                            <Activity :size="12" /> Ổn định
                        </span>
                    </div>
                    <div class="text-slate-500 fs-8 mt-2">Tính từ đầu năm hệ thống</div>
                </div>
            </div>

            <!-- Metric 4: Unreturned -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs shadow-hover transition-all">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <span class="text-slate-500 fs-7 fw-semibold">Đang mượn / Chưa trả</span>
                        <div class="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock :size="20" />
                        </div>
                    </div>
                    <div class="d-flex align-items-baseline justify-content-between">
                        <h3 class="fw-bold text-slate-900 mb-0 tracking-tight">{{ stats.unreturnedBorrows || 0 }}</h3>
                        <span 
                            class="badge fs-8 fw-semibold"
                            :class="stats.unreturnedBorrows > 0 ? 'badge-soft-amber' : 'badge-soft-emerald'"
                        >
                            {{ stats.unreturnedBorrows > 0 ? 'Cần theo dõi' : 'Đã hoàn tất' }}
                        </span>
                    </div>
                    <div class="text-slate-500 fs-8 mt-2">Sách hiện đang được độc giả lưu giữ</div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="row g-4 mb-4">
            <!-- Monthly Borrows Bar Chart -->
            <div class="col-12 col-lg-8">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs h-100 d-flex flex-column">
                    <div class="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <h6 class="fw-bold text-slate-900 mb-0">Thống Kê Lượt Mượn Theo Tháng</h6>
                            <span class="text-slate-500 fs-8">So sánh số lượt mượn & trả sách trong 6 tháng qua</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="d-inline-flex align-items-center gap-1 fs-8 text-slate-600">
                                <span class="d-inline-block rounded-circle bg-indigo-600" style="width: 8px; height: 8px;"></span>
                                Lượt mượn
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex-grow-1 min-h-250 position-relative">
                        <Bar v-if="chartData.data" :data="chartData.data" :options="chartData.options" />
                    </div>
                </div>
            </div>

            <!-- Distribution Doughnut Chart -->
            <div class="col-12 col-lg-4">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs h-100 d-flex flex-column">
                    <div class="mb-4">
                        <h6 class="fw-bold text-slate-900 mb-0">Phân Bổ Trạng Thái Phiếu</h6>
                        <span class="text-slate-500 fs-8">Tỷ lệ trả sách đúng hạn vs lưu giữ</span>
                    </div>

                    <div class="my-auto position-relative text-center p-3" style="max-height: 240px;">
                        <Doughnut v-if="pieData.data" :data="pieData.data" :options="pieData.options" />
                    </div>

                    <div class="mt-3 pt-3 border-top border-slate-100 d-flex justify-content-around text-center">
                        <div>
                            <div class="fs-8 text-slate-500 mb-0.5">Đã Hoàn Trả</div>
                            <div class="fw-bold text-emerald-600 fs-7">
                                {{ stats.totalBorrows ? Math.round(((stats.totalBorrows - stats.unreturnedBorrows) / stats.totalBorrows) * 100) : 100 }}%
                            </div>
                        </div>
                        <div class="vr bg-slate-200"></div>
                        <div>
                            <div class="fs-8 text-slate-500 mb-0.5">Đang Lưu Giữ</div>
                            <div class="fw-bold text-amber-600 fs-7">
                                {{ stats.totalBorrows ? Math.round((stats.unreturnedBorrows / stats.totalBorrows) * 100) : 0 }}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activities Table & Quick Stats -->
        <div class="row g-4">
            <!-- Recent Borrows -->
            <div class="col-12 col-xl-8">
                <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div class="p-4 border-bottom border-slate-100 d-flex align-items-center justify-content-between">
                        <div>
                            <h6 class="fw-bold text-slate-900 mb-0">Hoạt Động Mượn Sách Gần Đây</h6>
                            <span class="text-slate-500 fs-8">Cập nhật danh sách lượt giao dịch mới nhất</span>
                        </div>
                        <router-link to="/borrows" class="btn btn-outline-slate btn-sm rounded-lg fs-8 fw-semibold d-flex align-items-center gap-1">
                            <span>Xem tất cả</span>
                            <ArrowRight :size="14" />
                        </router-link>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-enterprise mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>Mã phiếu / Độc giả</th>
                                    <th>Tên Sách</th>
                                    <th>Ngày mượn</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isRecentLoading">
                                    <td colspan="4" class="text-center py-4">
                                        <div class="spinner-border spinner-border-sm text-indigo-600"></div>
                                    </td>
                                </tr>
                                <tr v-else-if="recentBorrows.length === 0">
                                    <td colspan="4" class="text-center py-4 text-slate-400 fs-7">
                                        Chưa có giao dịch mượn sách nào.
                                    </td>
                                </tr>
                                <tr v-for="b in recentBorrows" :key="b._id" v-else>
                                    <td>
                                        <div class="fw-semibold text-slate-900">
                                            {{ b.docGia ? `${b.docGia.hoLot || ''} ${b.docGia.ten || ''}` : 'Độc giả không tồn tại' }}
                                        </div>
                                        <div class="fs-8 text-slate-400">Mã ĐG: {{ b.docGia?.maDocGia || 'N/A' }}</div>
                                    </td>
                                    <td>
                                        <div class="fw-medium text-slate-800 text-truncate" style="max-width: 220px;">
                                            {{ b.sach?.tenSach || 'Sách đã xóa' }}
                                        </div>
                                        <div class="fs-8 text-slate-400">Mã sách: {{ b.sach?.maSach || 'N/A' }}</div>
                                    </td>
                                    <td class="fs-7 text-slate-600">
                                        {{ formatDate(b.ngayMuon) }}
                                    </td>
                                    <td>
                                        <span 
                                            class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold"
                                            :class="b.ngayTra ? 'badge-soft-emerald' : 'badge-soft-amber'"
                                        >
                                            {{ b.ngayTra ? 'Đã trả' : 'Đang mượn' }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Right Quick Tools / Info Cards -->
            <div class="col-12 col-xl-4">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-4">
                    <h6 class="fw-bold text-slate-900 mb-3">Lối Tắt Thao Tác Nhanh</h6>
                    <div class="d-grid gap-2">
                        <router-link to="/books/add" class="btn btn-slate-light text-start p-3 rounded-xl border d-flex align-items-center justify-content-between hover-bg-slate-100">
                            <div class="d-flex align-items-center gap-3">
                                <div class="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <BookOpen :size="18" />
                                </div>
                                <div>
                                    <div class="fw-semibold text-slate-800 fs-7">Thêm Sách Mới</div>
                                    <div class="fs-8 text-slate-500">Cập nhật đầu sách vào kho thư viện</div>
                                </div>
                            </div>
                            <ChevronRight :size="16" class="text-slate-400" />
                        </router-link>

                        <router-link to="/readers/add" class="btn btn-slate-light text-start p-3 rounded-xl border d-flex align-items-center justify-content-between hover-bg-slate-100">
                            <div class="d-flex align-items-center gap-3">
                                <div class="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <UserPlus :size="18" />
                                </div>
                                <div>
                                    <div class="fw-semibold text-slate-800 fs-7">Đăng Ký Độc Giả</div>
                                    <div class="fs-8 text-slate-500">Cấp thẻ độc giả mới</div>
                                </div>
                            </div>
                            <ChevronRight :size="16" class="text-slate-400" />
                        </router-link>

                        <router-link to="/publishers/add" class="btn btn-slate-light text-start p-3 rounded-xl border d-flex align-items-center justify-content-between hover-bg-slate-100">
                            <div class="d-flex align-items-center gap-3">
                                <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
                                    <Building2 :size="18" />
                                </div>
                                <div>
                                    <div class="fw-semibold text-slate-800 fs-7">Thêm Nhà Xuất Bản</div>
                                    <div class="fs-8 text-slate-500">Khai báo đối tác xuất bản mới</div>
                                </div>
                            </div>
                            <ChevronRight :size="16" class="text-slate-400" />
                        </router-link>
                    </div>
                </div>

                <div class="p-4 rounded-xl bg-gradient-indigo text-white shadow-sm border border-indigo-600">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <CheckCircle2 :size="20" class="text-emerald-300" />
                        <h6 class="fw-bold mb-0">Enterprise System v2.5</h6>
                    </div>
                    <p class="fs-7 opacity-90 mb-3">Toàn bộ dữ liệu được sao lưu và bảo mật tự động theo chuẩn vận hành Doanh nghiệp.</p>
                    <div class="fs-8 opacity-75">Trạng thái: Máy chủ hoạt động tối ưu (100% Uptime)</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import statService from '../services/stat.service';
import borrowService from '../services/borrow.service';
import Skeleton from '../components/Skeleton.vue';
import { 
    BookOpen, 
    Users, 
    Repeat, 
    Clock, 
    TrendingUp, 
    Activity, 
    RefreshCw, 
    Plus, 
    ArrowRight, 
    UserPlus, 
    Building2, 
    ChevronRight, 
    CheckCircle2 
} from 'lucide-vue-next';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const stats = ref({
    totalBooks: 0,
    totalReaders: 0,
    totalBorrows: 0,
    unreturnedBorrows: 0
});
const isLoading = ref(true);
const isRecentLoading = ref(false);
const recentBorrows = ref([]);

const chartData = ref({
    data: {
        labels: ['Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
        datasets: [
            {
                label: 'Lượt mượn',
                backgroundColor: '#4f46e5',
                borderRadius: 6,
                data: [18, 25, 32, 28, 45, 38]
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#f1f5f9' }, ticks: { stepSize: 10 } }
        }
    }
});

const pieData = ref({
    data: {
        labels: ['Đã trả đúng hạn', 'Đang lưu giữ'],
        datasets: [
            {
                backgroundColor: ['#10b981', '#f59e0b'],
                data: [75, 25],
                borderWidth: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } } }
    }
});

const fetchStats = async () => {
    isLoading.value = true;
    try {
        const response = await statService.getDashboardStats();
        stats.value = response.data;

        // Update Pie Chart Data dynamically
        const returnedCount = Math.max(0, (stats.value.totalBorrows || 0) - (stats.value.unreturnedBorrows || 0));
        pieData.value.data.datasets[0].data = [returnedCount, stats.value.unreturnedBorrows || 0];
    } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
    } finally {
        isLoading.value = false;
    }
};

const fetchRecentBorrows = async () => {
    isRecentLoading.value = true;
    try {
        const response = await borrowService.getAll({ page: 1, limit: 5 });
        recentBorrows.value = response.data;
    } catch (error) {
        console.error('Lỗi khi tải giao dịch gần đây:', error);
    } finally {
        isRecentLoading.value = false;
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN');
};

const refreshAll = () => {
    fetchStats();
    fetchRecentBorrows();
};

onMounted(() => {
    refreshAll();
});
</script>

<style scoped>
.bg-indigo-50 { background-color: #eef2ff; }
.text-indigo-600 { color: #4f46e5; }
.border-indigo-100 { border-color: #e0e7ff; }

.bg-emerald-50 { background-color: #ecfdf5; }
.text-emerald-600 { color: #059669; }
.border-emerald-100 { border-color: #a7f3d0; }

.bg-blue-50 { background-color: #eff6ff; }
.text-blue-600 { color: #2563eb; }
.border-blue-100 { border-color: #bfdbfe; }

.bg-amber-50 { background-color: #fffbeb; }
.text-amber-600 { color: #d97706; }
.border-amber-100 { border-color: #fde68a; }

.min-h-250 { min-height: 250px; }

.bg-gradient-indigo {
    background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
}

.spin-animation {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
