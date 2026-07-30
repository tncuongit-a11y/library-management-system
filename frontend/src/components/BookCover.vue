<template>
    <div :class="['book-cover-wrapper position-relative overflow-hidden shadow-sm border border-slate-200/80 rounded-lg', containerClass]" :style="{ width, height }">
        <img 
            v-if="coverUrl && !hasError" 
            :src="coverUrl" 
            :alt="title" 
            class="w-100 h-100 object-fit-cover transition-transform hover-scale"
            @error="hasError = true"
        />
        <div v-else class="w-100 h-100 d-flex flex-column justify-content-between p-3 position-relative text-white select-none" :style="{ background: coverGradient }">
            <div class="d-flex align-items-center justify-content-between">
                <span class="badge bg-white/20 backdrop-blur text-white border border-white/20 fs-8 fw-semibold px-2 py-0.5 rounded">
                    {{ code || 'LIB' }}
                </span>
                <BookOpen :size="16" class="opacity-75" />
            </div>

            <div class="my-auto py-2 text-center">
                <div class="fw-bold fs-7 lh-sm text-balance line-clamp-3 mb-1 font-serif text-white drop-shadow-sm">
                    {{ title || 'Sách Không Tên' }}
                </div>
                <div class="opacity-80 fs-8 text-truncate">
                    {{ author || 'Chưa rõ tác giả' }}
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-between pt-2 border-top border-white/10 fs-8 opacity-75">
                <span>Enterprise</span>
                <BookMarked :size="14" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { BookOpen, BookMarked } from 'lucide-vue-next';

const props = defineProps({
    coverUrl: { type: String, default: '' },
    title: { type: String, default: '' },
    author: { type: String, default: '' },
    code: { type: String, default: '' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '180px' },
    containerClass: { type: String, default: '' }
});

const hasError = ref(false);

// Deterministic gradient selection based on book title string
const gradients = [
    'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    'linear-gradient(135deg, #701a75 0%, #86198f 50%, #d946ef 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)',
    'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)'
];

const coverGradient = computed(() => {
    if (!props.title) return gradients[0];
    let hash = 0;
    for (let i = 0; i < props.title.length; i++) {
        hash = props.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
});
</script>

<style scoped>
.book-cover-wrapper {
    background-color: #f1f5f9;
}

.object-fit-cover {
    object-fit: cover;
}

.hover-scale {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.hover-scale:hover {
    transform: scale(1.04);
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.drop-shadow-sm {
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
}
</style>
