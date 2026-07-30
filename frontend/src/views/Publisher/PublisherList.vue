<template>
    <div>
        <!-- Page Header -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold text-slate-900 tracking-tight mb-1">Quản Lý Nhà Xuất Bản</h4>
                <p class="text-slate-500 fs-7 mb-0">Danh sách các đối tác xuất bản sách đối tác của thư viện.</p>
            </div>
            <router-link to="/publishers/add"
                class="btn btn-primary btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-semibold shadow-xs">
                <Plus :size="16" />
                <span>Thêm Nhà Xuất Bản</span>
            </router-link>
        </div>

        <!-- Filter / Search Bar -->
        <div class="bg-white p-3 p-md-4 rounded-xl border border-slate-200 shadow-xs mb-4">
            <div class="row g-3 align-items-center">
                <div class="col-12 col-md-5">
                    <div class="position-relative">
                        <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                            <Search :size="18" />
                        </span>
                        <input type="text" class="form-control ps-5 rounded-lg"
                            placeholder="Tìm kiếm theo tên NXB hoặc mã NXB..." v-model="searchText"
                            @keyup.enter="handleSearch" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <Skeleton v-for="i in 5" :key="i" height="42px" customClass="mb-2" />
        </div>

        <!-- Empty State -->
        <EmptyState v-else-if="publishers.length === 0" title="Chưa có nhà xuất bản nào"
            message="Không tìm thấy nhà xuất bản phù hợp với tìm kiếm của bạn." icon="inbox" action-text="Thêm NXB mới"
            @action="$router.push('/publishers/add')" />

        <!-- Table -->
        <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-4">
            <div class="table-responsive">
                <table class="table table-enterprise align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Mã NXB</th>
                            <th>Tên Nhà Xuất Bản</th>
                            <th>Địa chỉ trụ sở</th>
                            <th class="text-end">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pub in publishers" :key="pub._id">
                            <td style="width: 140px;">
                                <span class="badge bg-light text-dark fs-7 fw-semibold border">{{ pub.maNXB }}</span>
                            </td>
                            <td>
                                <div class="fw-bold text-slate-900 d-flex align-items-center gap-2">
                                    <Building2 :size="16" class="text-indigo-600" />
                                    <span>{{ pub.tenNXB }}</span>
                                </div>
                            </td>
                            <td class="text-slate-600 fs-7">
                                <div class="d-flex align-items-center gap-1.5">
                                    <MapPin :size="15" class="text-slate-400 flex-shrink-0" />
                                    <span>{{ pub.diaChi || 'Chưa cập nhật' }}</span>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex align-items-center gap-1">
                                    <router-link :to="`/publishers/edit/${pub._id}`"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-indigo-600"
                                        title="Chỉnh sửa">
                                        <Pencil :size="16" />
                                    </router-link>
                                    <button type="button"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-rose-600"
                                        @click="confirmDelete(pub)" title="Xóa">
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
        <ConfirmModal :is-open="isDeleteModalOpen" title="Xóa Nhà Xuất Bản"
            :message="`Bạn có chắc chắn muốn xóa NXB '${pubToDelete?.tenNXB}'? Lưu ý: Không thể xóa nếu còn đầu sách thuộc NXB này.`"
            confirm-text="Xóa vĩnh viễn" :is-loading="isDeleting" @confirm="executeDelete"
            @cancel="isDeleteModalOpen = false" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import publisherService from '../../services/publisher.service';
import { useToastStore } from '../../stores/toast.store';
import Skeleton from '../../components/Skeleton.vue';
import EmptyState from '../../components/EmptyState.vue';
import Pagination from '../../components/Pagination.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { Building2, Plus, Search, MapPin, Pencil, Trash2 } from 'lucide-vue-next';

const toast = useToastStore();

const publishers = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const pagination = ref({ page: 1, limit: 10, totalPages: 1 });

const isDeleteModalOpen = ref(false);
const pubToDelete = ref(null);
const isDeleting = ref(false);

const fetchPublishers = async () => {
    isLoading.value = true;
    try {
        const res = await publisherService.getAll({
            page: pagination.value.page,
            limit: pagination.value.limit,
            search: searchText.value
        });
        publishers.value = res.data;
        pagination.value = res.pagination;
    } catch (error) {
        toast.error('Có lỗi khi tải danh sách NXB.');
    } finally {
        isLoading.value = false;
    }
};

const handleSearch = () => {
    pagination.value.page = 1;
    fetchPublishers();
};

const changePage = (page) => {
    pagination.value.page = page;
    fetchPublishers();
};

const confirmDelete = (pub) => {
    pubToDelete.value = pub;
    isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
    if (!pubToDelete.value) return;
    isDeleting.value = true;
    try {
        await publisherService.delete(pubToDelete.value._id);
        toast.success(`Đã xóa NXB "${pubToDelete.value.tenNXB}" thành công.`);
        isDeleteModalOpen.value = false;
        pubToDelete.value = null;
        fetchPublishers();
    } catch (error) {
        toast.error(error.message || 'Không thể xóa NXB này.');
    } finally {
        isDeleting.value = false;
    }
};

onMounted(fetchPublishers);
</script>
