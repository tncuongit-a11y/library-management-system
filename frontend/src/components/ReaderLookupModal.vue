<template>
    <div v-if="isOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3 z-3">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-100 max-w-2xl overflow-hidden animate-pop">
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between p-4 border-bottom border-slate-100 bg-slate-50">
                <div class="d-flex align-items-center gap-2.5">
                    <div class="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                        <Search :size="20" />
                    </div>
                    <div>
                        <h5 class="fw-bold text-slate-900 mb-0">Tra Cứu Lịch Sử & Gia Hạn Sách</h5>
                        <span class="text-slate-500 fs-8">Dành cho Độc giả tra cứu cá nhân</span>
                    </div>
                </div>
                <button type="button" class="btn btn-slate-light p-1.5 rounded-lg text-slate-500 hover:text-slate-900" @click="$emit('close')">
                    <X :size="20" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-4 p-md-5 overflow-y-auto" style="max-height: 75vh;">
                <!-- Search input -->
                <form @submit.prevent="handleLookup" class="mb-4">
                    <label class="form-label fs-8 fw-bold text-slate-700">Nhập Số điện thoại hoặc Mã độc giả</label>
                    <div class="d-flex gap-2">
                        <div class="position-relative flex-grow-1">
                            <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                <PhoneCall :size="18" />
                            </span>
                            <input v-model="searchQuery" type="text" class="form-control ps-5 rounded-lg fs-7" placeholder="Ví dụ: 0981234567 hoặc DG001" required />
                        </div>
                        <button type="submit" class="btn btn-emerald px-4 fs-7 fw-semibold d-flex align-items-center gap-2" :disabled="isLoading">
                            <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                            <Search v-else :size="16" />
                            <span>Tra cứu</span>
                        </button>
                    </div>
                </form>

                <!-- Loading -->
                <div v-if="isLoading" class="py-5 text-center">
                    <div class="spinner-border text-emerald-600"></div>
                    <p class="text-slate-500 fs-7 mt-2 mb-0">Đang tìm kiếm hồ sơ độc giả...</p>
                </div>

                <!-- Result -->
                <div v-else-if="result">
                    <!-- Reader Header Card -->
                    <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 mb-4 d-flex align-items-center justify-content-between">
                        <div>
                            <div class="fw-bold text-slate-900 fs-6">
                                {{ result.reader.hoLot }} {{ result.reader.ten }}
                            </div>
                            <div class="fs-8 text-slate-500 d-flex gap-3 mt-1">
                                <span>Mã ĐG: <strong class="text-emerald-700">{{ result.reader.maDocGia }}</strong></span>
                                <span>SĐT: <strong class="text-slate-700">{{ result.reader.dienThoai }}</strong></span>
                            </div>
                        </div>
                        <span class="badge badge-soft-emerald px-3 py-1.5 rounded-full fs-8">Thẻ Hoạt Động</span>
                    </div>

                    <!-- Borrows list -->
                    <h6 class="fw-bold text-slate-900 fs-7 mb-3">Danh Sách Phiếu Mượn ({{ result.borrows.length }})</h6>

                    <div v-if="result.borrows.length === 0" class="text-center py-4 bg-slate-50 rounded-xl text-slate-400 fs-7">
                        Độc giả chưa từng có lịch sử mượn sách.
                    </div>

                    <div v-else class="d-grid gap-3">
                        <div v-for="b in result.borrows" :key="b._id" class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                            <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                                <div>
                                    <div class="fw-bold text-slate-900 fs-7">{{ b.sach?.tenSach || 'Sách' }}</div>
                                    <div class="fs-8 text-slate-500">Tác giả: {{ b.sach?.tacGia || 'N/A' }}</div>
                                </div>
                                <span class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold" :class="getStatusBadgeClass(b.computedStatus)">
                                    {{ getStatusText(b.computedStatus) }}
                                </span>
                            </div>

                            <div class="row g-2 fs-8 text-slate-600 bg-slate-50 p-2 rounded-lg my-2">
                                <div class="col-6">
                                    <span>Ngày mượn: </span>
                                    <strong class="text-slate-800">{{ formatDate(b.ngayMuon) }}</strong>
                                </div>
                                <div class="col-6">
                                    <span>Hạn phải trả: </span>
                                    <strong :class="b.computedStatus === 'QUA_HAN' ? 'text-rose-600 fw-bold' : 'text-slate-800'">
                                        {{ formatDate(b.ngayPhaiTra) }}
                                    </strong>
                                </div>
                                <div v-if="b.ngayTra" class="col-12">
                                    <span>Ngày đã trả: </span>
                                    <strong class="text-emerald-600">{{ formatDate(b.ngayTra) }}</strong>
                                </div>
                                <div v-if="b.phiPhat > 0" class="col-12 text-rose-600 fw-bold">
                                    <span>Phí phạt quá hạn: {{ formatCurrency(b.phiPhat) }}</span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="d-flex align-items-center justify-content-between mt-2">
                                <span class="fs-8 text-slate-400">Gia hạn: {{ b.soLanGiaHan || 0 }}/2 lần</span>
                                <button 
                                    v-if="b.computedStatus === 'DANG_MUON' && (b.soLanGiaHan || 0) < 2" 
                                    type="button" 
                                    class="btn btn-outline-indigo btn-sm rounded-lg fs-8 d-inline-flex align-items-center gap-1"
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
            </div>

            <div class="p-3 px-4 bg-slate-50 border-top border-slate-100 text-end">
                <button type="button" class="btn btn-slate-light px-4" @click="$emit('close')">
                    Đóng
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import borrowService from '../services/borrow.service';
import { useToastStore } from '../stores/toast.store';
import { Search, X, PhoneCall, Clock } from 'lucide-vue-next';

const props = defineProps({
    isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);
const toast = useToastStore();

const searchQuery = ref('');
const isLoading = ref(false);
const result = ref(null);
const extendingId = ref(null);

const handleLookup = async () => {
    if (!searchQuery.value.trim()) return;
    isLoading.value = true;
    result.value = null;
    try {
        const res = await borrowService.lookupReaderHistory(searchQuery.value);
        result.value = res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Không tìm thấy hồ sơ độc giả.');
    } finally {
        isLoading.value = false;
    }
};

const handleExtend = async (borrowId) => {
    extendingId.value = borrowId;
    try {
        await borrowService.extendBorrow(borrowId);
        toast.success('Gia hạn mượn sách thành công (+7 ngày)!');
        handleLookup();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể gia hạn.');
    } finally {
        extendingId.value = null;
    }
};

const getStatusBadgeClass = (st) => {
    switch (st) {
        case 'CHO_DUYET': return 'badge-soft-indigo';
        case 'DANG_MUON': return 'badge-soft-amber';
        case 'QUA_HAN': return 'badge-soft-rose';
        case 'DA_TRA': return 'badge-soft-emerald';
        default: return 'badge-soft-slate';
    }
};

const getStatusText = (st) => {
    switch (st) {
        case 'CHO_DUYET': return 'Chờ duyệt mượn';
        case 'DANG_MUON': return 'Đang mượn';
        case 'QUA_HAN': return 'Cảnh báo quá hạn!';
        case 'DA_TRA': return 'Đã hoàn trả';
        case 'TU_CHOI': return 'Đã bị từ chối';
        default: return 'Đang xử lý';
    }
};

const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('vi-VN');
};

const formatCurrency = (v) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
};
</script>

<style scoped>
.modal-backdrop-custom {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
}
.max-w-2xl { max-width: 680px; }
.btn-emerald { background-color: #059669; color: white; }
.btn-emerald:hover { background-color: #047857; color: white; }
.btn-outline-indigo { color: #4f46e5; border-color: #c7d2fe; }
.btn-outline-indigo:hover { background-color: #4f46e5; color: white; }
.bg-emerald-50\/60 { background-color: rgba(236, 253, 245, 0.6); }
@keyframes pop {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.animate-pop { animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
