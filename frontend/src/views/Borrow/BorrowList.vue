<template>
    <div>
        <!-- Page Header -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold text-slate-900 tracking-tight mb-1">Theo Dõi Mượn - Trả Sách</h4>
                <p class="text-slate-500 fs-7 mb-0">Quản lý giao dịch, duyệt đăng ký trực tuyến, gia hạn và tính phí phạt quá hạn.</p>
            </div>
            
            <div class="d-flex align-items-center gap-2">
                <button 
                    type="button" 
                    class="btn btn-outline-slate btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-semibold"
                    @click="exportCSV"
                >
                    <Download :size="16" />
                    <span>Xuất CSV</span>
                </button>

                <router-link to="/borrows/add" class="btn btn-primary btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-semibold shadow-xs">
                    <Plus :size="16" />
                    <span>Tạo Phiếu Mượn</span>
                </router-link>
            </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-3 p-md-4 rounded-xl border border-slate-200 shadow-xs mb-4">
            <div class="row g-3 align-items-center">
                <div class="col-12 col-md-6 col-lg-5">
                    <div class="position-relative">
                        <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                            <Search :size="18" />
                        </span>
                        <input 
                            v-model="searchText" 
                            type="text" 
                            class="form-control ps-5 rounded-lg" 
                            placeholder="Tìm kiếm theo tên độc giả, tên sách, mã ĐG..." 
                            @input="debouncedSearch"
                        />
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="position-relative">
                        <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                            <Filter :size="18" />
                        </span>
                        <select v-model="filterStatus" class="form-select ps-5 rounded-lg" @change="handleFilter">
                            <option value="">Tất cả trạng thái phiếu</option>
                            <option value="pending">Chờ duyệt mượn online</option>
                            <option value="borrowing">Đang mượn (Trong hạn)</option>
                            <option value="overdue">Cảnh báo Quá hạn</option>
                            <option value="returned">Đã hoàn trả</option>
                        </select>
                    </div>
                </div>

                <div class="col-12 col-lg-3 text-lg-end">
                    <span class="fs-8 text-slate-500">Hiển thị <strong>{{ borrows.length }}</strong> phiếu</span>
                </div>
            </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <Skeleton v-for="i in 6" :key="i" height="42px" customClass="mb-2" />
        </div>

        <!-- Empty State -->
        <EmptyState 
            v-else-if="borrows.length === 0"
            title="Chưa có phiếu mượn nào"
            message="Chưa tìm thấy thông tin phiếu mượn trả nào phù hợp với bộ lọc hiện tại."
            icon="inbox"
            action-text="Lập phiếu mượn mới"
            @action="$router.push('/borrows/add')"
        />

        <!-- Table -->
        <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-4">
            <div class="table-responsive">
                <table class="table table-enterprise align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Mã / Độc Giả</th>
                            <th>Đầu Sách Mượn</th>
                            <th>Ngày Mượn</th>
                            <th>Hạn Phải Trả</th>
                            <th>Trạng Thái</th>
                            <th>Phí Phạt Late</th>
                            <th class="text-end">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="b in borrows" :key="b._id">
                            <td>
                                <div class="fw-bold text-slate-900">
                                    {{ b.docGia ? `${b.docGia.hoLot || ''} ${b.docGia.ten || ''}` : 'Độc giả không tồn tại' }}
                                </div>
                                <div class="fs-8 text-slate-400 d-flex gap-2">
                                    <span>Mã: {{ b.docGia?.maDocGia || 'N/A' }}</span>
                                    <span>SĐT: {{ b.docGia?.dienThoai || 'N/A' }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="fw-semibold text-slate-800 text-truncate" style="max-width: 240px;">
                                    {{ b.sach?.tenSach || 'Sách đã xóa' }}
                                </div>
                                <div class="fs-8 text-slate-400">Mã sách: {{ b.sach?.maSach || 'N/A' }}</div>
                            </td>
                            <td class="fs-7 text-slate-700">
                                {{ formatDate(b.ngayMuon) }}
                            </td>
                            <td class="fs-7">
                                <span :class="b.trangThai === 'QUA_HAN' ? 'text-rose-600 fw-bold' : 'text-slate-700'">
                                    {{ formatDate(b.ngayPhaiTra) }}
                                </span>
                                <div v-if="b.soLanGiaHan > 0" class="fs-8 text-indigo-600">Gia hạn {{ b.soLanGiaHan }}/2 lần</div>
                            </td>
                            <td>
                                <span class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold" :class="getBadgeClass(b.trangThai)">
                                    <Clock v-if="b.trangThai === 'DANG_MUON'" :size="12" class="d-inline me-1" />
                                    <AlertCircle v-else-if="b.trangThai === 'QUA_HAN'" :size="12" class="d-inline me-1" />
                                    <CheckCircle2 v-else-if="b.trangThai === 'DA_TRA'" :size="12" class="d-inline me-1" />
                                    <HelpCircle v-else :size="12" class="d-inline me-1" />
                                    {{ getStatusLabel(b.trangThai) }}
                                </span>
                            </td>
                            <td class="fs-7">
                                <span v-if="b.phiPhat > 0" class="fw-bold text-rose-600">
                                    {{ formatCurrency(b.phiPhat) }}
                                </span>
                                <span v-else class="text-slate-400 fs-8">0 VNĐ</span>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex align-items-center gap-1.5">
                                    <!-- Online Request Approve / Deny -->
                                    <template v-if="b.trangThai === 'CHO_DUYET'">
                                        <button 
                                            type="button" 
                                            class="btn btn-emerald btn-sm rounded-lg fw-medium d-inline-flex align-items-center gap-1"
                                            @click="processRequest(b._id, 'approve')"
                                        >
                                            <Check :size="14" />
                                            <span>Duyệt</span>
                                        </button>
                                        <button 
                                            type="button" 
                                            class="btn btn-outline-rose btn-sm rounded-lg fw-medium d-inline-flex align-items-center gap-1"
                                            @click="processRequest(b._id, 'deny')"
                                        >
                                            <X :size="14" />
                                            <span>Từ chối</span>
                                        </button>
                                    </template>

                                    <!-- Active Borrow Actions -->
                                    <template v-else-if="b.trangThai === 'DANG_MUON' || b.trangThai === 'QUA_HAN'">
                                        <button 
                                            type="button" 
                                            class="btn btn-emerald btn-sm rounded-lg fw-medium d-inline-flex align-items-center gap-1 shadow-xs"
                                            @click="openReturnConfirm(b)"
                                        >
                                            <CheckCircle2 :size="14" />
                                            <span>Trả sách</span>
                                        </button>

                                        <button 
                                            v-if="(b.soLanGiaHan || 0) < 2"
                                            type="button" 
                                            class="btn btn-slate-light btn-sm rounded-lg text-indigo-600 fw-medium d-inline-flex align-items-center gap-1"
                                            title="Gia hạn thêm 7 ngày"
                                            @click="extendLoan(b._id)"
                                        >
                                            <Clock :size="14" />
                                            <span>+7n</span>
                                        </button>
                                    </template>

                                    <!-- Print Ticket Button -->
                                    <button 
                                        type="button" 
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-slate-900"
                                        title="In phiếu mượn"
                                        @click="openPrintModal(b)"
                                    >
                                        <Printer :size="16" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <Pagination 
            v-if="pagination.totalPages > 1" 
            :total-pages="pagination.totalPages" 
            :current-page="pagination.page" 
            @update:currentPage="changePage" 
        />

        <!-- Confirm Modal for Returning Book -->
        <ConfirmModal 
            :is-open="isConfirmOpen" 
            title="Xác Nhận Nhận Trả Sách" 
            :message="`Xác nhận độc giả '${selectedBorrow?.docGia?.hoLot || ''} ${selectedBorrow?.docGia?.ten || ''}' đã trả lại đầu sách '${selectedBorrow?.sach?.tenSach || ''}'? Số lượng sách sẽ được cộng lại vào kho.`"
            confirm-text="Xác nhận trả sách"
            :is-loading="isProcessing"
            @confirm="executeReturn"
            @cancel="isConfirmOpen = false"
        />

        <!-- Printable Receipt Modal -->
        <PrintTicketModal 
            :is-open="isPrintOpen" 
            :borrow="printBorrow" 
            @close="isPrintOpen = false" 
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import borrowService from '../../services/borrow.service';
import { useToastStore } from '../../stores/toast.store';
import Skeleton from '../../components/Skeleton.vue';
import EmptyState from '../../components/EmptyState.vue';
import Pagination from '../../components/Pagination.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import PrintTicketModal from '../../components/PrintTicketModal.vue';
import { Plus, Filter, Search, CheckCircle2, Clock, AlertCircle, HelpCircle, Check, X, Printer, Download } from 'lucide-vue-next';

const toast = useToastStore();

const borrows = ref([]);
const filterStatus = ref('');
const searchText = ref('');
const isLoading = ref(false);
const pagination = ref({ page: 1, limit: 10, totalPages: 1 });

const isConfirmOpen = ref(false);
const selectedBorrow = ref(null);
const isProcessing = ref(false);

const isPrintOpen = ref(false);
const printBorrow = ref(null);

let debounceTimer = null;
const debouncedSearch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        pagination.value.page = 1;
        fetchBorrows();
    }, 300);
};

const fetchBorrows = async () => {
    isLoading.value = true;
    try {
        const res = await borrowService.getAll({
            page: pagination.value.page,
            limit: pagination.value.limit,
            status: filterStatus.value,
            search: searchText.value
        });
        borrows.value = res.data;
        pagination.value = res.pagination;
    } catch (error) {
        toast.error('Lỗi khi tải danh sách mượn sách.');
    } finally {
        isLoading.value = false;
    }
};

const handleFilter = () => {
    pagination.value.page = 1;
    fetchBorrows();
};

const changePage = (page) => {
    pagination.value.page = page;
    fetchBorrows();
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN');
};

const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const getBadgeClass = (st) => {
    switch (st) {
        case 'CHO_DUYET': return 'badge-soft-indigo';
        case 'DANG_MUON': return 'badge-soft-amber';
        case 'QUA_HAN': return 'badge-soft-rose';
        case 'DA_TRA': return 'badge-soft-emerald';
        case 'TU_CHOI': return 'badge-soft-slate';
        default: return 'badge-soft-amber';
    }
};

const getStatusLabel = (st) => {
    switch (st) {
        case 'CHO_DUYET': return 'Chờ duyệt mượn';
        case 'DANG_MUON': return 'Đang lưu giữ';
        case 'QUA_HAN': return 'Quá hạn!';
        case 'DA_TRA': return 'Đã hoàn trả';
        case 'TU_CHOI': return 'Đã từ chối';
        default: return 'Đang mượn';
    }
};

const openReturnConfirm = (b) => {
    selectedBorrow.value = b;
    isConfirmOpen.value = true;
};

const executeReturn = async () => {
    if (!selectedBorrow.value) return;
    isProcessing.value = true;
    try {
        const res = await borrowService.returnBook(selectedBorrow.value._id);
        const fineMsg = res.data.phiPhat > 0 ? ` Phí phạt quá hạn: ${formatCurrency(res.data.phiPhat)}` : '';
        toast.success(`Nhận trả sách thành công!${fineMsg}`);
        isConfirmOpen.value = false;
        selectedBorrow.value = null;
        fetchBorrows();
    } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Lỗi khi nhận trả sách.');
    } finally {
        isProcessing.value = false;
    }
};

const extendLoan = async (id) => {
    try {
        await borrowService.extendBorrow(id);
        toast.success('Đã gia hạn mượn sách thành công (+7 ngày)!');
        fetchBorrows();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể gia hạn.');
    }
};

const processRequest = async (id, action) => {
    try {
        await borrowService.processOnlineRequest(id, action);
        const msg = action === 'approve' ? 'Đã duyệt yêu cầu mượn!' : 'Đã từ chối yêu cầu.';
        toast.success(msg);
        fetchBorrows();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xử lý yêu cầu.');
    }
};

const openPrintModal = (b) => {
    printBorrow.value = b;
    isPrintOpen.value = true;
};

const exportCSV = () => {
    if (borrows.value.length === 0) {
        toast.error('Không có dữ liệu để xuất CSV');
        return;
    }

    const headers = ['Mã Phiếu', 'Độc Giả', 'SĐT', 'Mã ĐG', 'Sách Mượn', 'Mã Sách', 'Ngày Mượn', 'Hạn Trả', 'Trạng Thái', 'Phí Phạt'];
    const rows = borrows.value.map(b => [
        b._id,
        `"${b.docGia?.hoLot || ''} ${b.docGia?.ten || ''}"`,
        `"${b.docGia?.dienThoai || ''}"`,
        `"${b.docGia?.maDocGia || ''}"`,
        `"${b.sach?.tenSach || ''}"`,
        `"${b.sach?.maSach || ''}"`,
        formatDate(b.ngayMuon),
        formatDate(b.ngayPhaiTra),
        getStatusLabel(b.trangThai),
        b.phiPhat || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_muon_sach_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất file CSV thành công!');
};

onMounted(fetchBorrows);
</script>

<style scoped>
.btn-emerald { background-color: #059669; color: white; }
.btn-emerald:hover { background-color: #047857; color: white; }
.btn-outline-rose { color: #e11d48; border-color: #fecdd3; }
.btn-outline-rose:hover { background-color: #e11d48; color: white; }
.btn-outline-slate { color: #475569; border-color: #cbd5e1; }
.btn-outline-slate:hover { background-color: #f1f5f9; }
</style>
