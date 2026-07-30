<template>
    <section id="categories-section" class="py-5 bg-slate-50 border-top border-slate-200">
        <div class="max-w-7xl mx-auto px-4 px-md-5">
            <!-- Header -->
            <div class="text-center max-w-2xl mx-auto mb-5">
                <div class="d-inline-flex align-items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full fs-8 fw-semibold mb-2">
                    <Grid :size="14" />
                    <span>Bộ Sưu Tập</span>
                </div>
                <h4 class="fw-bold text-slate-900 tracking-tight mb-2">Thể Loại & Chủ Đề Phổ Biến</h4>
                <p class="text-slate-500 fs-7 mb-0">Khám phá sách theo các chủ đề chuyên sâu phù hợp với nhu cầu học tập và nghiên cứu</p>
            </div>

            <!-- Categories Grid -->
            <div class="row g-3 g-md-4">
                <div 
                    v-for="cat in categoryList" 
                    :key="cat.name" 
                    class="col-12 col-sm-6 col-lg-4"
                >
                    <div 
                        class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs shadow-hover transition-all cursor-pointer h-100 d-flex align-items-center gap-3.5 group"
                        @click="$emit('select-category', cat.name)"
                    >
                        <div 
                            class="p-3.5 rounded-2xl d-flex align-items-center justify-content-center flex-shrink-0 transition-transform group-hover:scale-110"
                            :class="cat.bgClass"
                        >
                            <component :is="cat.icon" :size="26" :class="cat.iconColorClass" />
                        </div>

                        <div class="flex-grow-1 overflow-hidden">
                            <h6 class="fw-bold text-slate-900 mb-1 fs-6 group-hover:text-indigo-600 transition-colors">
                                {{ cat.name }}
                            </h6>
                            <p class="text-slate-500 fs-8 mb-2 line-clamp-1">
                                {{ cat.description }}
                            </p>
                            <div class="d-flex align-items-center gap-1 text-indigo-600 fs-8 fw-bold">
                                <span>Khám phá ngay</span>
                                <ChevronRight :size="14" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { 
    Grid, 
    Code, 
    BookOpenText, 
    TrendingUp, 
    Atom, 
    HeartHandshake, 
    Globe, 
    ChevronRight 
} from 'lucide-vue-next';

const emit = defineEmits(['select-category']);

const categoryList = [
    {
        name: 'Công nghệ & Lập trình',
        description: 'Lập trình Web, AI, Khoa học dữ liệu & Hệ thống',
        icon: Code,
        bgClass: 'bg-indigo-50 border border-indigo-100',
        iconColorClass: 'text-indigo-600'
    },
    {
        name: 'Văn học & Nghệ thuật',
        description: 'Tiểu thuyết, Thơ ca, Tác phẩm văn học kinh điển',
        icon: BookOpenText,
        bgClass: 'bg-rose-50 border border-rose-100',
        iconColorClass: 'text-rose-600'
    },
    {
        name: 'Kinh tế & Quản trị',
        description: 'Tài chính, Quản trị doanh nghiệp & Khởi nghiệp',
        icon: TrendingUp,
        bgClass: 'bg-emerald-50 border border-emerald-100',
        iconColorClass: 'text-emerald-600'
    },
    {
        name: 'Khoa học & Kỹ thuật',
        description: 'Vật lý, Toán học, Tự động hóa & Kỹ thuật số',
        icon: Atom,
        bgClass: 'bg-amber-50 border border-amber-100',
        iconColorClass: 'text-amber-600'
    },
    {
        name: 'Kỹ năng sống',
        description: 'Phát triển bản thân, Tâm lý học & Quản lý thời gian',
        icon: HeartHandshake,
        bgClass: 'bg-purple-50 border border-purple-100',
        iconColorClass: 'text-purple-600'
    },
    {
        name: 'Lịch sử & Văn hóa',
        description: 'Lịch sử thế giới, Văn hóa Việt Nam & Triết học',
        icon: Globe,
        bgClass: 'bg-slate-100 border border-slate-200',
        iconColorClass: 'text-slate-700'
    }
];
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }
.max-w-2xl { max-width: 672px; }
.cursor-pointer { cursor: pointer; }

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.bg-rose-50 { background-color: #fff1f2; }
.border-rose-100 { border-color: #ffe4e6; }
.text-rose-600 { color: #e11d48; }

.bg-emerald-50 { background-color: #ecfdf5; }
.border-emerald-100 { border-color: #d1fae5; }
.text-emerald-600 { color: #059669; }

.bg-amber-50 { background-color: #fffbeb; }
.border-amber-100 { border-color: #fef3c7; }
.text-amber-600 { color: #d97706; }

.bg-purple-50 { background-color: #faf5ff; }
.border-purple-100 { border-color: #f3e8ff; }
.text-purple-600 { color: #9333ea; }
</style>
