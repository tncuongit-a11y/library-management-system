<template>
    <section id="search-section" class="py-5 bg-white border-bottom border-slate-200">
        <div class="max-w-7xl mx-auto px-4 px-md-5">
            <div class="rounded-3xl p-4 p-md-5 shadow-2xl position-relative overflow-hidden" style="background-color: #0f172a;">
                <!-- Background Accent Circle -->
                <div class="position-absolute top-0 end-0 rounded-full blur-2xl" style="width: 300px; height: 300px; background-color: rgba(79, 70, 229, 0.15); pointer-events: none;"></div>

                <div class="position-relative z-10 max-w-4xl mx-auto text-center">
                    <h3 class="fw-bold tracking-tight mb-2" style="color: #ffffff !important;">Tra Cứu & Tìm Kiếm Tủ Sách</h3>
                    <p class="fs-7 mb-4" style="color: #cbd5e1 !important;">Nhập tên sách, tác giả, mã ISBN hoặc chọn thể loại để tìm nhanh tài liệu bạn cần</p>

                    <!-- Main Search Input Bar -->
                    <div class="bg-white p-2.5 rounded-2xl shadow-xl border border-slate-200">
                        <div class="row g-2 align-items-center">
                            <!-- Search Input -->
                            <div class="col-12 col-md-5">
                                <div class="position-relative">
                                    <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400">
                                        <Search :size="20" />
                                    </span>
                                    <input 
                                        type="text" 
                                        class="form-control border-0 ps-5 py-2.5 fs-7 rounded-xl text-slate-900 fw-medium bg-transparent shadow-none" 
                                        placeholder="Tên sách, tác giả, mã sách (VD: MS001)..."
                                        :value="searchText"
                                        @input="$emit('update:searchText', $event.target.value)"
                                        @keyup.enter="$emit('triggerSearch')"
                                    />
                                </div>
                            </div>

                            <!-- Category Filter Dropdown -->
                            <div class="col-12 col-md-3 border-start-md border-slate-200">
                                <div class="position-relative">
                                    <select 
                                        class="form-select border-0 py-2.5 fs-7 rounded-xl text-slate-700 fw-semibold bg-transparent shadow-none"
                                        :value="selectedCategory"
                                        @change="$emit('update:selectedCategory', $event.target.value)"
                                    >
                                        <option value="">Tất cả Thể Loại</option>
                                        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Status Filter Dropdown -->
                            <div class="col-12 col-md-2 border-start-md border-slate-200">
                                <select 
                                    class="form-select border-0 py-2.5 fs-7 rounded-xl text-slate-700 fw-semibold bg-transparent shadow-none"
                                    :value="selectedStatus"
                                    @change="$emit('update:selectedStatus', $event.target.value)"
                                >
                                    <option value="">Trạng Thái</option>
                                    <option value="available">Sẵn sàng (Còn sách)</option>
                                    <option value="out">Đã mượn hết</option>
                                </select>
                            </div>

                            <!-- Search Button -->
                            <div class="col-12 col-md-2">
                                <button 
                                    type="button" 
                                    class="btn btn-primary w-100 py-2.5 rounded-xl fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                                    @click="$emit('triggerSearch')"
                                >
                                    <Search :size="18" />
                                    <span>Tìm kiếm</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Tag Suggestions -->
                    <div class="mt-3.5 d-flex flex-wrap align-items-center justify-content-center gap-2 text-slate-400 fs-8">
                        <span class="fw-semibold text-slate-300 me-1">Gợi ý tìm kiếm:</span>
                        <button 
                            v-for="tag in quickTags" 
                            :key="tag"
                            type="button" 
                            class="btn btn-sm btn-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 fs-8 transition-colors"
                            @click="selectQuickTag(tag)"
                        >
                            #{{ tag }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Search } from 'lucide-vue-next';

const props = defineProps({
    searchText: { type: String, default: '' },
    selectedCategory: { type: String, default: '' },
    selectedStatus: { type: String, default: '' },
    categories: { 
        type: Array, 
        default: () => [
            'Công nghệ & Lập trình',
            'Văn học & Nghệ thuật',
            'Kinh tế & Quản trị',
            'Kỹ năng sống',
            'Khoa học & Kỹ thuật',
            'Lịch sử & Văn hóa'
        ] 
    }
});

const emit = defineEmits(['update:searchText', 'update:selectedCategory', 'update:selectedStatus', 'triggerSearch']);

const quickTags = [
    'Vue 3',
    'Node.js',
    'Tiểu thuyết',
    'Tài chính',
    'Tâm lý học',
    'NXB Trẻ'
];

const selectQuickTag = (tag) => {
    emit('update:searchText', tag);
    emit('triggerSearch');
};
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }
.max-w-4xl { max-width: 896px; }

.btn-slate-800 {
    background-color: #1e293b;
}
.btn-slate-800:hover {
    background-color: #334155;
}

@media (min-width: 768px) {
    .border-start-md {
        border-left: 1px solid #e2e8f0 !important;
    }
}
</style>
