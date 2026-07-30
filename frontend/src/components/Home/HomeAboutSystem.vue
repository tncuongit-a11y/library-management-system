<template>
    <section id="about-section" class="py-5 py-md-6 bg-white border-top border-slate-200">
        <div class="max-w-7xl mx-auto px-4 px-md-5">
            <div class="row align-items-center g-5">
                <!-- Left Column: Visual graphic & Feature Highlight -->
                <div class="col-12 col-lg-6">
                    <div class="position-relative">
                        <div class="bg-indigo-600/5 rounded-3xl p-4 p-md-5 border border-indigo-100">
                            <div class="d-inline-flex p-3 bg-indigo-600 text-white rounded-2xl shadow-lg mb-4">
                                <Library :size="32" />
                            </div>
                            <h3 class="fw-extrabold text-slate-900 tracking-tight mb-3">
                                Nâng Tầm Trải Nghiệm Thư Viện Doanh Nghiệp & Học Thuật
                            </h3>
                            <p class="text-slate-600 fs-7 leading-relaxed mb-4">
                                Hệ thống LibraryHub được xây dựng trên nền tảng công nghệ tiên tiến, hỗ trợ chuẩn hóa toàn bộ quy trình tự động hóa thư viện. Từ việc phân loại đầu sách, theo dõi đối tác nhà xuất bản, cấp thẻ thành viên đến kiểm soát lưu thông mượn trả chính xác.
                            </p>

                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                                        <div class="d-flex align-items-center gap-2 text-indigo-600 fw-bold fs-7 mb-1">
                                            <Zap :size="16" />
                                            <span>Tốc độ xử lý</span>
                                        </div>
                                        <span class="text-slate-500 fs-8">Tìm kiếm & xuất phiếu mượn &lt; 1 giây</span>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                                        <div class="d-flex align-items-center gap-2 text-emerald-600 fw-bold fs-7 mb-1">
                                            <ShieldCheck :size="16" />
                                            <span>Chính xác 100%</span>
                                        </div>
                                        <span class="text-slate-500 fs-8">Kiểm soát tồn kho & hạn trả tức thì</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: 4 Key Features -->
                <div class="col-12 col-lg-6">
                    <div class="d-flex flex-column gap-3.5">
                        <!-- Feature 1 -->
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs d-flex gap-3 align-items-start">
                            <div class="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl flex-shrink-0">
                                <Search :size="22" />
                            </div>
                            <div>
                                <h6 class="fw-bold text-slate-900 mb-1">Tra Cứu Thông Minh & Đa Dạng</h6>
                                <p class="text-slate-500 fs-7 mb-0">
                                    Hỗ trợ lọc sách linh hoạt theo tên tác phẩm, tác giả, mã ISBN hoặc nhà xuất bản, giúp độc giả nhanh chóng tìm thấy tài liệu phù hợp.
                                </p>
                            </div>
                        </div>

                        <!-- Feature 2 -->
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs d-flex gap-3 align-items-start">
                            <div class="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl flex-shrink-0">
                                <Repeat :size="22" />
                            </div>
                            <div>
                                <h6 class="fw-bold text-slate-900 mb-1">Quản Lý Mượn Trả Tự Động</h6>
                                <p class="text-slate-500 fs-7 mb-0">
                                    Tự động tính toán hạn trả sách, cảnh báo các trường hợp quá hạn và lưu trữ lịch sử lưu thông chi tiết từng độc giả.
                                </p>
                            </div>
                        </div>

                        <!-- Feature 3 -->
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs d-flex gap-3 align-items-start">
                            <div class="p-2.5 bg-purple-100 text-purple-600 rounded-xl flex-shrink-0">
                                <Users :size="22" />
                            </div>
                            <div>
                                <h6 class="fw-bold text-slate-900 mb-1">Hồ Sơ Độc Giả Chuẩn Hóa</h6>
                                <p class="text-slate-500 fs-7 mb-0">
                                    Cấp mã thẻ độc giả duy nhất, lưu thông tin liên hệ và số điện thoại giúp thủ thư tra cứu và chăm sóc thành viên dễ dàng.
                                </p>
                            </div>
                        </div>

                        <!-- Feature 4 -->
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs d-flex gap-3 align-items-start">
                            <div class="p-2.5 bg-amber-100 text-amber-600 rounded-xl flex-shrink-0">
                                <BarChart2 :size="22" />
                            </div>
                            <div>
                                <h6 class="fw-bold text-slate-900 mb-1">Báo Cáo Thống Kê Trực Quan</h6>
                                <p class="text-slate-500 fs-7 mb-0">
                                    Biểu đồ tổng quan số lượng mượn trả, top sách yêu thích và năng suất làm việc của nhân viên theo thời gian thực.
                                </p>
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
    Library, 
    Zap, 
    ShieldCheck, 
    Search, 
    Repeat, 
    Users, 
    BarChart2 
} from 'lucide-vue-next';
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }
.bg-purple-100 { background-color: #f3e8ff; }
.text-purple-600 { color: #9333ea; }
.bg-amber-100 { background-color: #fef3c7; }
.text-amber-600 { color: #d97706; }
</style>
