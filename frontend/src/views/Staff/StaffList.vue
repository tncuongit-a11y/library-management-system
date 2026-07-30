<template>
    <div>
        <!-- Page Header -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold text-slate-900 tracking-tight mb-1">Quản Lý Nhân Viên Thư Viện</h4>
                <p class="text-slate-500 fs-7 mb-0">Quản trị danh sách nhân sự và phân quyền hệ thống.</p>
            </div>
            <router-link to="/staffs/add"
                class="btn btn-primary btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-semibold shadow-xs">
                <UserPlus :size="16" />
                <span>Thêm Nhân Viên</span>
            </router-link>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <Skeleton v-for="i in 5" :key="i" height="42px" customClass="mb-2" />
        </div>

        <!-- Empty State -->
        <EmptyState v-else-if="staffs.length === 0" title="Chưa có nhân viên nào"
            message="Chưa khai báo danh sách nhân sự vận hành hệ thống." icon="users" action-text="Thêm nhân viên mới"
            @action="$router.push('/staffs/add')" />

        <!-- Table -->
        <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-4">
            <div class="table-responsive">
                <table class="table table-enterprise align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Mã NV</th>
                            <th>Họ và Tên</th>
                            <th>Chức vụ / Quyền</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ công tác</th>
                            <th class="text-end">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="staff in staffs" :key="staff._id">
                            <td style="width: 120px;">
                                <span class="badge bg-light border text-dark fs-8 fw-semibold">
                                    {{ staff.msnv }}
                                </span>
                            </td>
                            <td>
                                <div class="fw-bold text-slate-900 d-flex align-items-center gap-2">
                                    <div class="rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 fw-bold fs-8 d-flex align-items-center justify-content-center text-uppercase"
                                        style="width: 32px; height: 32px;">
                                        {{ getInitials(staff.hoTen) }}
                                    </div>
                                    <span>{{ staff.hoTen }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold"
                                    :class="staff.chucVu === 'Quản lý' ? 'badge-soft-rose' : 'badge-soft-indigo'">
                                    <ShieldCheck v-if="staff.chucVu === 'Quản lý'" :size="13" class="d-inline me-1" />
                                    {{ staff.chucVu }}
                                </span>
                            </td>
                            <td class="fs-7 text-slate-800 fw-medium">
                                <div class="d-flex align-items-center gap-1.5">
                                    <Phone :size="14" class="text-slate-400" />
                                    <span>{{ staff.soDienThoai }}</span>
                                </div>
                            </td>
                            <td class="text-slate-600 fs-7">
                                <div class="d-flex align-items-center gap-1.5">
                                    <MapPin :size="14" class="text-slate-400 flex-shrink-0" />
                                    <span>{{ staff.diaChi || 'Chưa cập nhật' }}</span>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex align-items-center gap-1">
                                    <router-link :to="`/staffs/edit/${staff._id}`"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-indigo-600"
                                        title="Chỉnh sửa">
                                        <Pencil :size="16" />
                                    </router-link>
                                    <button type="button"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-rose-600"
                                        @click="confirmDelete(staff)" title="Xóa">
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

        <!-- Confirm Modal -->
        <ConfirmModal :is-open="isDeleteModalOpen" title="Xóa Hồ Sơ Nhân Viên"
            :message="`Bạn có chắc chắn muốn xóa nhân viên '${staffToDelete?.hoTen}' (${staffToDelete?.msnv}) khỏi hệ thống không?`"
            confirm-text="Xóa vĩnh viễn" :is-loading="isDeleting" @confirm="executeDelete"
            @cancel="isDeleteModalOpen = false" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import staffService from '../../services/staff.service';
import { useToastStore } from '../../stores/toast.store';
import Skeleton from '../../components/Skeleton.vue';
import EmptyState from '../../components/EmptyState.vue';
import Pagination from '../../components/Pagination.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { ShieldCheck, UserPlus, Phone, MapPin, Pencil, Trash2 } from 'lucide-vue-next';

const toast = useToastStore();

const staffs = ref([]);
const isLoading = ref(false);
const pagination = ref({ page: 1, limit: 10, totalPages: 1 });

const isDeleteModalOpen = ref(false);
const staffToDelete = ref(null);
const isDeleting = ref(false);

const fetchStaffs = async () => {
    isLoading.value = true;
    try {
        const res = await staffService.getAll({
            page: pagination.value.page,
            limit: pagination.value.limit
        });
        staffs.value = res.data;
        pagination.value = res.pagination;
    } catch (error) {
        toast.error('Lỗi khi tải danh sách nhân viên.');
    } finally {
        isLoading.value = false;
    }
};

const changePage = (page) => {
    pagination.value.page = page;
    fetchStaffs();
};

const getInitials = (name) => {
    if (!name) return 'NV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const confirmDelete = (staff) => {
    staffToDelete.value = staff;
    isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
    if (!staffToDelete.value) return;
    isDeleting.value = true;
    try {
        await staffService.delete(staffToDelete.value._id);
        toast.success(`Đã xóa nhân viên "${staffToDelete.value.hoTen}" thành công.`);
        isDeleteModalOpen.value = false;
        staffToDelete.value = null;
        fetchStaffs();
    } catch (error) {
        toast.error(error.message || 'Lỗi khi xóa nhân viên này.');
    } finally {
        isDeleting.value = false;
    }
};

onMounted(fetchStaffs);
</script>
