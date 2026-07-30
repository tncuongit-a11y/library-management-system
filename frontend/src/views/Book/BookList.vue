<template>
    <div>
        <!-- Page Header & Actions -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold text-slate-900 tracking-tight mb-1">Quản Lý Sách & Kho Lưu Trữ</h4>
                <p class="text-slate-500 fs-7 mb-0">Danh mục toàn bộ sách hiện có trong hệ thống thư viện.</p>
            </div>
            <div class="d-flex align-items-center gap-2">
                <!-- View Mode Switcher -->
                <div class="btn-group rounded-lg p-1 bg-slate-200/80 border border-slate-300/60" role="group">
                    <button type="button" class="btn btn-xs rounded-md fw-medium transition-all"
                        :class="viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                        @click="viewMode = 'grid'" title="Hiển thị dạng Lưới Card">
                        <LayoutGrid :size="16" />
                    </button>
                    <button type="button" class="btn btn-xs rounded-md fw-medium transition-all"
                        :class="viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                        @click="viewMode = 'table'" title="Hiển thị dạng Bảng">
                        <List :size="16" />
                    </button>
                </div>

                <router-link to="/books/add"
                    class="btn btn-primary btn-sm rounded-lg d-flex align-items-center gap-1.5 fw-semibold shadow-xs">
                    <Plus :size="16" />
                    <span>Thêm Sách Mới</span>
                </router-link>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white p-3 p-md-4 rounded-xl border border-slate-200 shadow-xs mb-4">
            <div class="row g-3 align-items-center">
                <!-- Search Box -->
                <div class="col-12 col-md-5">
                    <div class="position-relative">
                        <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                            <Search :size="18" />
                        </span>
                        <input type="text" class="form-control ps-5 rounded-lg"
                            placeholder="Tìm theo tên sách, tác giả hoặc mã sách..." v-model="searchText"
                            @keyup.enter="handleSearch" />
                    </div>
                </div>

                <!-- Publisher Filter -->
                <div class="col-12 col-sm-6 col-md-4">
                    <select v-model="selectedPublisher" class="form-select rounded-lg" @change="handleSearch">
                        <option value="">Tất cả Nhà xuất bản</option>
                        <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
                            {{ pub.tenNXB }}
                        </option>
                    </select>
                </div>

                <!-- Sort Filter -->
                <div class="col-12 col-sm-6 col-md-3">
                    <select v-model="sortBy" class="form-select rounded-lg" @change="handleSort">
                        <option value="createdAt_desc">Mới nhất</option>
                        <option value="tenSach_asc">Tên sách (A-Z)</option>
                        <option value="donGia_asc">Giá tăng dần</option>
                        <option value="donGia_desc">Giá giảm dần</option>
                        <option value="soQuyen_desc">Số lượng tồn kho</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="mb-4">
            <div v-if="viewMode === 'grid'" class="row g-4">
                <div v-for="i in 8" :key="i" class="col-12 col-sm-6 col-md-4 col-xl-3">
                    <div class="bg-white p-3 rounded-xl border border-slate-200">
                        <Skeleton height="200px" radius="8px" customClass="mb-3" />
                        <Skeleton height="18px" width="80%" customClass="mb-2" />
                        <Skeleton height="14px" width="60%" customClass="mb-2" />
                        <Skeleton height="24px" width="40%" />
                    </div>
                </div>
            </div>
            <div v-else class="bg-white rounded-xl border border-slate-200 p-4">
                <Skeleton v-for="i in 5" :key="i" height="40px" customClass="mb-2" />
            </div>
        </div>

        <!-- Empty State -->
        <EmptyState v-else-if="books.length === 0" title="Không tìm thấy sách nào"
            message="Hãy thử thay đổi từ khóa tìm kiếm hoặc lọc nhà xuất bản khác." icon="book"
            action-text="Thêm sách mới" @action="$router.push('/books/add')" />

        <!-- GRID VIEW (Online Bookstore Style) -->
        <div v-else-if="viewMode === 'grid'" class="row g-4 mb-4">
            <div v-for="book in books" :key="book._id" class="col-12 col-sm-6 col-md-4 col-xl-3">
                <div
                    class="bg-white rounded-2xl border border-slate-200 shadow-xs shadow-hover transition-all h-100 d-flex flex-column overflow-hidden">
                    <!-- Book Cover Container -->
                    <div class="p-3 bg-slate-50 border-bottom border-slate-100 position-relative cursor-pointer"
                        @click="openBookDetail(book)">
                        <BookCover :cover-url="book.hinhAnh" :title="book.tenSach" :author="book.tacGia"
                            :code="book.maSach" height="220px"
                            container-class="mx-auto rounded-xl shadow-md max-w-180" />
                        <span
                            class="position-absolute top-0 end-0 m-4 badge rounded-full px-2.5 py-1 fs-8 fw-bold shadow-xs"
                            :class="book.soQuyen > 0 ? 'badge-soft-emerald' : 'badge-soft-rose'">
                            {{ book.soQuyen > 0 ? `Còn ${book.soQuyen}` : 'Hết sách' }}
                        </span>
                    </div>

                    <!-- Book Information Body -->
                    <div class="p-3.5 flex-grow-1 d-flex flex-column">
                        <div class="fs-8 text-indigo-600 fw-semibold text-uppercase tracking-wider mb-1">
                            {{ book.nhaXuatBan?.tenNXB || 'Chưa rõ NXB' }}
                        </div>
                        <h6 class="fw-bold text-slate-900 mb-1 leading-snug line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
                            @click="openBookDetail(book)">
                            {{ book.tenSach }}
                        </h6>
                        <div class="text-slate-500 fs-7 mb-3 text-truncate">
                            {{ book.tacGia }} &bull; {{ book.namXuatBan }}
                        </div>

                        <div
                            class="mt-auto pt-3 border-top border-slate-100 d-flex align-items-center justify-content-between">
                            <div class="fw-bold text-slate-900 fs-6">
                                {{ book.donGia ? book.donGia.toLocaleString('vi-VN') + ' đ' : 'Miễn phí' }}
                            </div>

                            <div class="d-flex align-items-center gap-1">
                                <button type="button"
                                    class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-indigo-600"
                                    @click="openBookDetail(book)" title="Xem chi tiết">
                                    <Eye :size="16" />
                                </button>
                                <router-link :to="`/books/edit/${book._id}`"
                                    class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-indigo-600"
                                    title="Chỉnh sửa">
                                    <Pencil :size="16" />
                                </router-link>
                                <button type="button"
                                    class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-rose-600"
                                    @click="confirmDelete(book)" title="Xóa">
                                    <Trash2 :size="16" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TABLE VIEW -->
        <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-4">
            <div class="table-responsive">
                <table class="table table-enterprise align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Bìa / Mã</th>
                            <th>Tên Sách</th>
                            <th>Tác Giả</th>
                            <th>Nhà Xuất Bản</th>
                            <th>Năm XB</th>
                            <th>Đơn Giá</th>
                            <th>Tồn Kho</th>
                            <th class="text-end">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="book in books" :key="book._id">
                            <td style="width: 100px;">
                                <div class="d-flex align-items-center gap-2">
                                    <div class="cursor-pointer" @click="openBookDetail(book)">
                                        <BookCover :cover-url="book.hinhAnh" :title="book.tenSach" :author="book.tacGia"
                                            :code="book.maSach" width="42px" height="56px" container-class="rounded" />
                                    </div>
                                    <span class="badge bg-light border text-dark fs-8 fw-semibold">{{ book.maSach
                                        }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="fw-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
                                    @click="openBookDetail(book)">
                                    {{ book.tenSach }}
                                </div>
                            </td>
                            <td class="text-slate-600 fs-7">{{ book.tacGia }}</td>
                            <td class="text-slate-600 fs-7">{{ book.nhaXuatBan?.tenNXB || 'N/A' }}</td>
                            <td class="text-slate-600 fs-7">{{ book.namXuatBan }}</td>
                            <td class="fw-semibold text-slate-900 fs-7">{{ book.donGia.toLocaleString('vi-VN') }} đ</td>
                            <td>
                                <span class="badge px-2.5 py-1 rounded-full fs-8 fw-semibold"
                                    :class="book.soQuyen > 0 ? 'badge-soft-emerald' : 'badge-soft-rose'">
                                    {{ book.soQuyen > 0 ? `${book.soQuyen} quyển` : 'Hết sách' }}
                                </span>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex align-items-center gap-1">
                                    <button type="button"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-indigo-600"
                                        @click="openBookDetail(book)" title="Xem">
                                        <Eye :size="16" />
                                    </button>
                                    <router-link :to="`/books/edit/${book._id}`"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-indigo-600"
                                        title="Sửa">
                                        <Pencil :size="16" />
                                    </router-link>
                                    <button type="button"
                                        class="btn btn-slate-light p-1.5 rounded-lg text-slate-600 hover:text-rose-600"
                                        @click="confirmDelete(book)" title="Xóa">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination Bar -->
        <Pagination v-if="pagination.totalPages > 1" :total-pages="pagination.totalPages"
            :current-page="pagination.page" @update:currentPage="changePage" />

        <!-- Modals -->
        <BookDetailModal :is-open="isDetailOpen" :book="selectedBook" @close="isDetailOpen = false" />

        <ConfirmModal :is-open="isDeleteModalOpen" title="Xóa Sách Khỏi Hệ Thống"
            :message="`Bạn có chắc chắn muốn xóa đầu sách '${bookToDelete?.tenSach}' không? Dữ liệu mượn sách liên quan có thể bị ảnh hưởng.`"
            confirm-text="Xóa vĩnh viễn" :is-loading="isDeleting" @confirm="executeDelete"
            @cancel="isDeleteModalOpen = false" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookService from '../../services/book.service';
import publisherService from '../../services/publisher.service';
import { useToastStore } from '../../stores/toast.store';
import BookCover from '../../components/BookCover.vue';
import BookDetailModal from '../../components/BookDetailModal.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import Skeleton from '../../components/Skeleton.vue';
import EmptyState from '../../components/EmptyState.vue';
import Pagination from '../../components/Pagination.vue';
import {
    LayoutGrid,
    List,
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2
} from 'lucide-vue-next';

const toast = useToastStore();

const books = ref([]);
const publishers = ref([]);
const isLoading = ref(false);
const searchText = ref('');
const selectedPublisher = ref('');
const sortBy = ref('createdAt_desc');
const viewMode = ref('grid');

const pagination = ref({ page: 1, limit: 12, totalPages: 1 });

// Modals state
const isDetailOpen = ref(false);
const selectedBook = ref(null);

const isDeleteModalOpen = ref(false);
const bookToDelete = ref(null);
const isDeleting = ref(false);

const fetchPublishers = async () => {
    try {
        const response = await publisherService.getAll({ limit: 100 });
        publishers.value = response.data;
    } catch (err) {
        console.error('Lỗi tải danh sách NXB:', err);
    }
};

const fetchBooks = async () => {
    isLoading.value = true;
    try {
        const response = await bookService.getAll({
            page: pagination.value.page,
            limit: pagination.value.limit,
            search: searchText.value,
            publisher: selectedPublisher.value,
            sort: sortBy.value
        });
        books.value = response.data;
        pagination.value = response.pagination;
    } catch (error) {
        toast.error('Có lỗi xảy ra khi tải danh sách sách.');
    } finally {
        isLoading.value = false;
    }
};

const handleSearch = () => {
    pagination.value.page = 1;
    fetchBooks();
};

const handleSort = () => {
    pagination.value.page = 1;
    fetchBooks();
};

const changePage = (page) => {
    pagination.value.page = page;
    fetchBooks();
};

const openBookDetail = (book) => {
    selectedBook.value = book;
    isDetailOpen.value = true;
};

const confirmDelete = (book) => {
    bookToDelete.value = book;
    isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
    if (!bookToDelete.value) return;
    isDeleting.value = true;
    try {
        await bookService.delete(bookToDelete.value._id);
        toast.success(`Đã xóa sách "${bookToDelete.value.tenSach}" thành công.`);
        isDeleteModalOpen.value = false;
        bookToDelete.value = null;

        if (books.value.length === 1 && pagination.value.page > 1) {
            pagination.value.page -= 1;
        }
        fetchBooks();
    } catch (error) {
        toast.error(error.message || 'Không thể xóa sách này.');
    } finally {
        isDeleting.value = false;
    }
};

onMounted(() => {
    fetchPublishers();
    fetchBooks();
});
</script>

<style scoped>
.max-w-180 {
    max-width: 180px;
}

.cursor-pointer {
    cursor: pointer;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.btn-xs {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
</style>
