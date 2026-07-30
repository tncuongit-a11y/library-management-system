<template>
    <div>
        <!-- Page Header -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold text-slate-900 tracking-tight mb-1">Quản Lý Độc Giả</h4>
                <p class="text-slate-500 fs-7 mb-0">Hồ sơ thành viên và cấp thẻ đọc mượn sách thư viện.</p>
            </div>
            <router-link to="/readers/add"
                class="btn btn-primary btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-semibold shadow-xs">
                <UserPlus :size="16" />
                <span>Thêm Độc Giả</span>
            </router-link>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white p-3 p-md-4 rounded-xl border border-slate-200 shadow-xs mb-4">
            <div class="row g-3 align-items-center">
                <div class="col-12 col-md-5">
                    <div class="position-relative">
                        <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                            <Search :size="18" />
                        </span>
                        <input type="text" class="form-control ps-5 rounded-lg"
                            placeholder="Tìm kiếm theo tên độc giả hoặc số điện thoại..." v-model="searchText"
                            @keyup.enter="handleSearch" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <Skeleton v-for="i in 6" :key="i" height="42px" customClass="mb-2" />
        </div>

        <!-- Empty State -->
        <EmptyState v-else-if="readers.length === 0" title="Chưa có độc giả nào"
            message="Không tìm thấy thông tin độc giả phù hợp với từ khóa tìm kiếm." icon="users"
            action-text="Thêm độc giả mới" @action="$router.push('/readers/add')" />

        <!-- Table -->
        <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-4">
            <div class="table-responsive">
                <table class="table table-enterprise align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Mã ĐG</th>
                            <th>Họ và Tên</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ liên hệ</th>
                            <th class="text-end">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in readers" :key="r._id">
                            <td style="width: 120px;">
                                <span class="badge badge-soft-indigo text-dark fs-8 fw-semibold">{{ r.maDocGia }}</span>
                            </td>
                            <td>
                                <div class="fw-bold text-slate-900 d-flex align-items-center gap-2">
                                    <div class="rounded-full bg-slate-100 text-slate-600 border border-slate-200 fw-semibold fs-8 d-flex align-items-center justify-content-center text-uppercase"
                                        style="width: 32px; height: 32px;">
                                        {{ getInitials(r.hoLot, r.ten) }}
                                    </div>
                                    <span>{{ r.hoLot }} {{ r.ten }}</span>
                                </div>
                            </td>
                            <td class="fs-7 text-slate-600">
                                <span class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold"
                                    :class="r.phai === 'Nam' ? 'badge-soft-indigo' : 'badge-soft-amber'">
                                    {{ r.phai }}
                                </span>
                            </td>
                            <td class="fs-7 text-slate-600">
                                <div class="d-flex align-items-center gap-1.5">
                                    <Calendar :size="14" class="text-slate-400" />
                                    <span>{{ formatDate(r.ngaySinh) }}</span>
                                </div>
                            </td>
                            <td class="fs-7 text-slate-800 fw-medium">
                                <div class="d-flex align-items-center gap-1.5">
                                    <Phone :size="14" class="text-slate-400" />
                                    <span>{{ r.dienThoai }}</span>
                                </div>
                            </td>
                            <td class="text-slate-600 fs-7">
                                <div class="d-flex align-items-center gap-1.5">
                                    <MapPin :size="14" class="text-slate-400 flex-shrink-0" />
                                    <span class="text-truncate" style="max-width: 200px;">{{ r.diaChi || 'Chưa cập nhật'
                                        }}</span>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex align-items-center gap-1">
                                    <router-link :to="`/readers/edit/${r._id}`"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-indigo-600"
                                        title="Chỉnh sửa">
                                        <Pencil :size="16" />
                                    </router-link>
                                    <button type="button"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-rose-600"
                                        @click="confirmDelete(r)" title="Xóa">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <Pagination v-if="pagination.totalPages > 1" :total-pages="pagination.totalPages"
            :current-page="pagination.page" @update:currentPage="changePage" />

        <!-- Confirm Delete Modal -->
        <ConfirmModal :is-open="isDeleteModalOpen" title="Xóa Thẻ Độc Giả"
            :message="`Bạn có chắc chắn muốn xóa hồ sơ độc giả '${readerToDelete?.hoLot || ''} ${readerToDelete?.ten || ''}' không?`"
            confirm-text="Xóa vĩnh viễn" :is-loading="isDeleting" @confirm="executeDelete"
            @cancel="isDeleteModalOpen = false" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import readerService from '../../services/reader.service';
import { useToastStore } from '../../stores/toast.store';
import Skeleton from '../../components/Skeleton.vue';
import EmptyState from '../../components/EmptyState.vue';
import Pagination from '../../components/Pagination.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { UserPlus, Search, Calendar, Phone, MapPin, Pencil, Trash2 } from 'lucide-vue-next';

const toast = useToastStore();

const readers = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const pagination = ref({ page: 1, limit: 10, totalPages: 1 });

const isDeleteModalOpen = ref(false);
const readerToDelete = ref(null);
const isDeleting = ref(false);

const fetchReaders = async () => {
    isLoading.value = true;
    try {
        const res = await readerService.getAll({
            page: pagination.value.page,
            limit: pagination.value.limit,
            search: searchText.value
        });
        readers.value = res.data;
        pagination.value = res.pagination;
    } catch (error) {
        toast.error('Lỗi khi tải danh sách độc giả.');
    } finally {
        isLoading.value = false;
    }
};

const handleSearch = () => {
    pagination.value.page = 1;
    fetchReaders();
};

const changePage = (page) => {
    pagination.value.page = page;
    fetchReaders();
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN');
};

const getInitials = (ho, ten) => {
    const first = ho ? ho.trim()[0] : 'D';
    const last = ten ? ten.trim()[0] : 'G';
    return (first + last).toUpperCase();
};

const confirmDelete = (r) => {
    readerToDelete.value = r;
    isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
    if (!readerToDelete.value) return;
    isDeleting.value = true;
    try {
        await readerService.delete(readerToDelete.value._id);
        toast.success(`Đã xóa độc giả "${readerToDelete.value.hoLot} ${readerToDelete.value.ten}" thành công.`);
        isDeleteModalOpen.value = false;
        readerToDelete.value = null;
        if (readers.value.length === 1 && pagination.value.page > 1) pagination.value.page -= 1;
        fetchReaders();
    } catch (error) {
        toast.error(error.message || 'Lỗi khi xóa độc giả này.');
    } finally {
        isDeleting.value = false;
    }
};

onMounted(fetchReaders);
</script>
