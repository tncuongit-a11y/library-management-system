<template>
    <div v-if="isOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3 z-3">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-100 max-w-xl overflow-hidden animate-pop">
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between p-4 border-bottom border-slate-100 bg-slate-50 print-hide">
                <div class="d-flex align-items-center gap-2">
                    <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Printer :size="20" />
                    </div>
                    <div>
                        <h5 class="fw-bold text-slate-900 mb-0">In Phiếu Mượn Sách</h5>
                        <span class="text-slate-500 fs-8">Hệ thống Quản lý Thư viện Doanh nghiệp</span>
                    </div>
                </div>
                <button type="button" class="btn btn-slate-light p-1.5 rounded-lg text-slate-500 hover:text-slate-900" @click="$emit('close')">
                    <X :size="20" />
                </button>
            </div>

            <!-- Printable Receipt Container -->
            <div id="printable-ticket" class="p-4 p-md-5 bg-white text-slate-900">
                <div class="text-center pb-3 mb-3 border-bottom border-dashed border-slate-300">
                    <div class="fw-bold fs-5 text-indigo-900">THƯ VIỆN BÁCH KHOA ACADEMIA</div>
                    <div class="fs-8 text-slate-500">123 Lý Thường Kiệt, Q.10, TP. Hồ Chí Minh - Hotline: 1900 6789</div>
                    <h4 class="fw-black tracking-wider text-slate-900 mt-3 mb-1 uppercase">PHIẾU MƯỢN SÁCH</h4>
                    <span class="fs-8 fw-mono text-slate-400">Mã phiếu: #{{ borrow?._id?.slice(-8).toUpperCase() }}</span>
                </div>

                <!-- Info Grid -->
                <div class="row g-2 fs-7 mb-3">
                    <div class="col-6">
                        <span class="text-slate-500 fs-8 d-block">Độc giả:</span>
                        <strong class="text-slate-900">{{ borrow?.docGia?.hoLot }} {{ borrow?.docGia?.ten }}</strong>
                    </div>
                    <div class="col-6">
                        <span class="text-slate-500 fs-8 d-block">Mã Độc giả:</span>
                        <strong class="text-indigo-600 fw-mono">{{ borrow?.docGia?.maDocGia }}</strong>
                    </div>
                    <div class="col-6 mt-2">
                        <span class="text-slate-500 fs-8 d-block">Số điện thoại:</span>
                        <span>{{ borrow?.docGia?.dienThoai || 'N/A' }}</span>
                    </div>
                    <div class="col-6 mt-2">
                        <span class="text-slate-500 fs-8 d-block">Ngày lập phiếu:</span>
                        <span>{{ formatDate(borrow?.ngayMuon) }}</span>
                    </div>
                </div>

                <!-- Book details table -->
                <div class="border border-slate-200 rounded-lg overflow-hidden mb-3">
                    <table class="table table-sm mb-0 fs-7">
                        <thead class="bg-slate-100">
                            <tr>
                                <th>Tên Đầu Sách</th>
                                <th>Mã Sách</th>
                                <th class="text-end">Hạn Trả</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fw-bold text-slate-800">{{ borrow?.sach?.tenSach }}</td>
                                <td class="fw-mono fs-8 text-slate-600">{{ borrow?.sach?.maSach }}</td>
                                <td class="text-end fw-bold text-rose-600">{{ formatDate(borrow?.ngayPhaiTra) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- QR Code Representation -->
                <div class="text-center py-2 bg-slate-50 rounded-xl border border-slate-200 mb-3">
                    <div class="d-inline-block bg-white p-2 rounded border border-slate-200 shadow-xs mb-1">
                        <QrCode :size="80" class="text-slate-900" />
                    </div>
                    <div class="fs-8 fw-mono text-slate-500">Scan QR Code để xác thực nhận trả nhanh</div>
                </div>

                <div class="row text-center fs-8 pt-3 border-top border-dashed border-slate-300">
                    <div class="col-6">
                        <div class="fw-bold mb-4">Người Mượn Sách</div>
                        <div class="text-slate-400 italic">(Ký và ghi rõ họ tên)</div>
                    </div>
                    <div class="col-6">
                        <div class="fw-bold mb-4">Thủ Thư Xác Nhận</div>
                        <div class="text-slate-400 italic">(Ký và đóng dấu)</div>
                    </div>
                </div>
            </div>

            <!-- Footer Actions -->
            <div class="p-3 px-4 bg-slate-50 border-top border-slate-100 d-flex justify-content-end gap-2 print-hide">
                <button type="button" class="btn btn-slate-light px-4" @click="$emit('close')">
                    Đóng
                </button>
                <button type="button" class="btn btn-indigo px-4 d-flex align-items-center gap-2 fw-semibold" @click="handlePrint">
                    <Printer :size="16" />
                    <span>In Phiếu Ngay</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Printer, X, QrCode } from 'lucide-vue-next';

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    borrow: { type: Object, default: null }
});

defineEmits(['close']);

const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('vi-VN');
};

const handlePrint = () => {
    window.print();
};
</script>

<style scoped>
.modal-backdrop-custom {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
}
.max-w-xl { max-width: 560px; }
.btn-indigo { background-color: #4f46e5; color: white; }
.btn-indigo:hover { background-color: #4338ca; color: white; }

@media print {
    body * {
        visibility: hidden;
    }
    #printable-ticket, #printable-ticket * {
        visibility: visible;
    }
    #printable-ticket {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
    .print-hide {
        display: none !important;
    }
}
@keyframes pop {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.animate-pop { animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
