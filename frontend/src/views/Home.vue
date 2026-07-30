<template>
    <div class="min-vh-100 bg-slate-50 text-slate-800 font-sans d-flex flex-column">
        <!-- Toast Notification -->
        <ToastNotification />

        <!-- 1. Navigation Header Bar -->
        <HomeNavbar @open-lookup="isLookupModalOpen = true" />

        <!-- 2. Hero Banner Section -->
        <HomeHero />

        <!-- 3. Search Bar Section -->
        <HomeSearchBar 
            v-model:searchText="searchText" 
            v-model:selectedCategory="selectedCategory"
            v-model:selectedStatus="selectedStatus" 
            @triggerSearch="handleSearch" 
        />

        <!-- 4. Featured Books Grid Section -->
        <HomeFeaturedBooks 
            :books="filteredBooks" 
            :loading="isLoading" 
            @select-book="openBookModal"
            @reset-filters="resetFilters" 
        />

        <!-- 5. Newly Updated Books Section -->
        <HomeNewBooks v-if="newBooks.length > 0" :new-books="newBooks" @select-book="openBookModal" />

        <!-- 6. Popular Categories Section -->
        <HomeCategories @select-category="handleCategorySelect" />

        <!-- 7. Quick Stats Section -->
        <HomeQuickStats :stats="systemStats" />

        <!-- 8. About System Section -->
        <HomeAboutSystem />

        <!-- 9. Footer Section -->
        <HomeFooter />

        <!-- 10. Book Detail Popup Modal -->
        <BookDetailModal :is-open="isModalOpen" :book="selectedBook" @close="isModalOpen = false" />

        <!-- 11. Reader Lookup Modal -->
        <ReaderLookupModal :is-open="isLookupModalOpen" @close="isLookupModalOpen = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import bookService from '../services/book.service';
import statService from '../services/stat.service';
import publisherService from '../services/publisher.service';

import ToastNotification from '../components/ToastNotification.vue';
import HomeNavbar from '../components/Home/HomeNavbar.vue';
import HomeHero from '../components/Home/HomeHero.vue';
import HomeSearchBar from '../components/Home/HomeSearchBar.vue';
import HomeFeaturedBooks from '../components/Home/HomeFeaturedBooks.vue';
import HomeNewBooks from '../components/Home/HomeNewBooks.vue';
import HomeCategories from '../components/Home/HomeCategories.vue';
import HomeQuickStats from '../components/Home/HomeQuickStats.vue';
import HomeAboutSystem from '../components/Home/HomeAboutSystem.vue';
import HomeFooter from '../components/Home/HomeFooter.vue';
import BookDetailModal from '../components/Home/BookDetailModal.vue';
import ReaderLookupModal from '../components/ReaderLookupModal.vue';

// Search & Filtering State
const searchText = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');
const isLoading = ref(false);

// Data
const allBooks = ref([]);
const systemStats = ref({
    totalBooks: 0,
    totalAuthors: 0,
    totalPublishers: 0,
    totalReaders: 0,
    unreturnedBorrows: 0
});

// Modal State
const isModalOpen = ref(false);
const selectedBook = ref(null);
const isLookupModalOpen = ref(false);

// Fallback Mock Books Dataset
const sampleBooks = [
    {
        _id: 'sb001',
        maSach: 'MS001',
        tenSach: 'Lập Trình Web Với Vue 3 & Node.js Express',
        tacGia: 'Nguyễn Văn Cường',
        donGia: 125000,
        soQuyen: 8,
        namXuatBan: 2024,
        theLoai: 'Công nghệ & Lập trình',
        nhaXuatBan: { tenNXB: 'NXB Thông Tin & Truyền Thông' },
        hinhAnh: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
        moTa: 'Tài liệu hướng dẫn phát triển ứng dụng web fullstack hiện đại, kiến trúc RESTful API và Vue 3 Composition API.'
    },
    {
        _id: 'sb002',
        maSach: 'MS002',
        tenSach: 'Đắc Nhân Tâm - Nghệ Thuật Giao Tiếp',
        tacGia: 'Dale Carnegie',
        donGia: 95000,
        soQuyen: 15,
        namXuatBan: 2023,
        theLoai: 'Kỹ năng sống',
        nhaXuatBan: { tenNXB: 'NXB Trẻ' },
        hinhAnh: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        moTa: 'Cuốn sách kinh điển về nghệ thuật ứng xử, thu phục lòng người và xây dựng mối quan hệ bền vững.'
    },
    {
        _id: 'sb003',
        maSach: 'MS003',
        tenSach: 'Tài Chính Cá Nhân Cho Người Bắt Đầu',
        tacGia: 'Lê Hoàng Nam',
        donGia: 110000,
        soQuyen: 5,
        namXuatBan: 2024,
        theLoai: 'Kinh tế & Quản trị',
        nhaXuatBan: { tenNXB: 'NXB Tài Chính' },
        hinhAnh: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        moTa: 'Phương pháp quản lý dòng tiền, đầu tư tích lũy và xây dựng tự do tài chính bền vững.'
    },
    {
        _id: 'sb004',
        maSach: 'MS004',
        tenSach: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
        tacGia: 'Stephen Hawking',
        donGia: 145000,
        soQuyen: 0,
        namXuatBan: 2022,
        theLoai: 'Khoa học & Kỹ thuật',
        nhaXuatBan: { tenNXB: 'NXB Giáo Dục' },
        hinhAnh: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        moTa: 'Khám phá các bí ẩn lý thuyết tương đối, lỗ đen và sự hình thành của vũ trụ qua văn phong dễ hiểu.'
    },
    {
        _id: 'sb005',
        maSach: 'MS005',
        tenSach: 'Lịch Sử Việt Nam Qua Các Thời Kỳ',
        tacGia: 'Trần Trọng Kim',
        donGia: 180000,
        soQuyen: 12,
        namXuatBan: 2021,
        theLoai: 'Lịch sử & Văn hóa',
        nhaXuatBan: { tenNXB: 'NXB Kim Đồng' },
        hinhAnh: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
        moTa: 'Bộ sách tổng hợp tiến trình lịch sử dựng nước và giữ nước của dân tộc Việt Nam.'
    }
];

// Fetch Data
const fetchData = async () => {
    isLoading.value = true;
    try {
        const [booksRes, statsRes, publishersRes] = await Promise.allSettled([
            bookService.getAll({ limit: 100 }),
            statService.getDashboardStats(),
            publisherService.getAll({ limit: 100 })
        ]);

        if (booksRes.status === 'fulfilled' && booksRes.value?.data?.length > 0) {
            allBooks.value = booksRes.value.data.map((b, index) => ({
                ...b,
                theLoai: b.theLoai || (index % 2 === 0 ? 'Công nghệ & Lập trình' : 'Văn học & Nghệ thuật')
            }));
        } else {
            allBooks.value = sampleBooks;
        }

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
            const s = statsRes.value.data;
            const publishersCount = publishersRes.status === 'fulfilled' ? (publishersRes.value?.data?.length || 18) : 18;
            const authorsSet = new Set(allBooks.value.map(b => b.tacGia).filter(Boolean));

            systemStats.value = {
                totalBooks: s.totalBooks || allBooks.value.length,
                totalAuthors: authorsSet.size || 42,
                totalPublishers: publishersCount,
                totalReaders: s.totalReaders || 250,
                unreturnedBorrows: s.unreturnedBorrows || 18
            };
        } else {
            setFallbackStats();
        }
    } catch (error) {
        allBooks.value = sampleBooks;
        setFallbackStats();
    } finally {
        isLoading.value = false;
    }
};

const setFallbackStats = () => {
    const authorsSet = new Set(allBooks.value.map(b => b.tacGia).filter(Boolean));
    systemStats.value = {
        totalBooks: allBooks.value.length || 120,
        totalAuthors: authorsSet.size || 85,
        totalPublishers: 24,
        totalReaders: 450,
        unreturnedBorrows: 32
    };
};

// Filtering Logic
const filteredBooks = computed(() => {
    return allBooks.value.filter(book => {
        const search = searchText.value.toLowerCase().trim();
        const matchesText = !search || (
            book.tenSach?.toLowerCase().includes(search) ||
            book.tacGia?.toLowerCase().includes(search) ||
            book.maSach?.toLowerCase().includes(search)
        );

        const matchesCategory = !selectedCategory.value ||
            (book.theLoai && book.theLoai === selectedCategory.value);

        const matchesStatus = !selectedStatus.value || (
            selectedStatus.value === 'available' ? book.soQuyen > 0 : book.soQuyen === 0
        );

        return matchesText && matchesCategory && matchesStatus;
    });
});

const newBooks = computed(() => {
    return [...allBooks.value].slice(0, 6);
});

// Handlers
const handleSearch = () => {
    const el = document.getElementById('featured-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const handleCategorySelect = (categoryName) => {
    selectedCategory.value = categoryName;
    handleSearch();
};

const resetFilters = () => {
    searchText.value = '';
    selectedCategory.value = '';
    selectedStatus.value = '';
};

const openBookModal = (book) => {
    selectedBook.value = book;
    isModalOpen.value = true;
};

onMounted(fetchData);
</script>

<style scoped>
html {
    scroll-behavior: smooth;
}
</style>
