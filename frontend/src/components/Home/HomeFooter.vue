<template>
    <footer class="pt-5 pb-4 border-top border-slate-800" style="background-color: #0f172a; color: #cbd5e1;">
        <div class="max-w-7xl mx-auto px-4 px-md-5">
            <div class="row g-4 g-lg-5 pb-5 border-bottom border-slate-800">
                <!-- Column 1: Brand & Description -->
                <div class="col-12 col-lg-4">
                    <div class="d-flex align-items-center gap-2.5 text-white mb-3">
                        <div class="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md d-flex align-items-center justify-content-center">
                            <Library :size="22" />
                        </div>
                        <div class="fw-extrabold fs-5 tracking-tight text-white">
                            Library<span style="color: #818cf8;">Hub</span>
                        </div>
                    </div>
                    <p class="fs-7 leading-relaxed mb-4" style="color: #cbd5e1;">
                        Hệ thống quản lý thư viện số hiện đại. Cung cấp giải pháp lưu trữ, tra cứu và quản lý tài liệu học thuật cho tổ chức và doanh nghiệp.
                    </p>
                    <div class="d-flex align-items-center gap-3 fs-8" style="color: #a5b4fc;">
                        <span class="d-inline-flex align-items-center gap-1.5">
                            <span class="rounded-full bg-emerald-400 d-inline-block" style="width: 8px; height: 8px;"></span>
                            Thư viện mở cửa phục vụ
                        </span>
                    </div>
                </div>

                <!-- Column 2: Quick Links -->
                <div class="col-12 col-sm-6 col-lg-2">
                    <h6 class="fw-bold fs-7 uppercase tracking-wider mb-3" style="color: #ffffff;">Liên Kết Nhanh</h6>
                    <ul class="list-unstyled d-flex flex-column gap-2 fs-7 mb-0">
                        <li><a href="#hero" class="footer-link">Trang Chủ</a></li>
                        <li><a href="#search-section" class="footer-link">Tra Cứu Sách</a></li>
                        <li><a href="#featured-section" class="footer-link">Sách Nổi Bật</a></li>
                        <li><a href="#categories-section" class="footer-link">Thể Loại Sách</a></li>
                        <li><a href="#stats-section" class="footer-link">Thống Kê Nhanh</a></li>
                        <li><router-link to="/login" class="footer-link fw-semibold" style="color: #818cf8 !important;">Đăng Nhập Quản Trị</router-link></li>
                    </ul>
                </div>

                <!-- Column 3: Contact Info -->
                <div class="col-12 col-sm-6 col-lg-3">
                    <h6 class="fw-bold fs-7 uppercase tracking-wider mb-3" style="color: #ffffff;">Thông Tin Liên Hệ</h6>
                    <ul class="list-unstyled d-flex flex-column gap-2.5 fs-7 mb-0" style="color: #cbd5e1;">
                        <li class="d-flex align-items-start gap-2.5">
                            <MapPin :size="18" class="flex-shrink-0 mt-0.5" style="color: #818cf8;" />
                            <span>123 Đường 3/2, Q. Ninh Kiều, TP. Cần Thơ</span>
                        </li>
                        <li class="d-flex align-items-center gap-2.5">
                            <Phone :size="18" class="flex-shrink-0" style="color: #818cf8;" />
                            <span>Hotline: (0292) 3831 555</span>
                        </li>
                        <li class="d-flex align-items-center gap-2.5">
                            <Mail :size="18" class="flex-shrink-0" style="color: #818cf8;" />
                            <span>Email: thuvien@libraryhub.edu.vn</span>
                        </li>
                        <li class="d-flex align-items-center gap-2.5">
                            <Clock :size="18" class="flex-shrink-0" style="color: #818cf8;" />
                            <span>Thứ 2 - Thứ 7: 07:30 - 20:30</span>
                        </li>
                    </ul>
                </div>

                <!-- Column 4: Newsletter / Operating Rules -->
                <div class="col-12 col-lg-3">
                    <h6 class="fw-bold fs-7 uppercase tracking-wider mb-3" style="color: #ffffff;">Quy Định Mượn Trả</h6>
                    <p class="fs-8 mb-3" style="color: #cbd5e1;">
                        Mỗi độc giả được mượn tối đa 3 quyển sách cùng lúc trong thời hạn 14 ngày. Vui lòng giữ gìn sách cẩn thận.
                    </p>
                    <div class="p-3 rounded-xl border border-slate-700 fs-8" style="background-color: #1e293b; color: #cbd5e1;">
                        <div class="fw-bold mb-1" style="color: #a5b4fc;">Cần Hỗ Trợ Nhanh?</div>
                        <span>Liên hệ quầy thủ thư hoặc gửi email phản hồi nếu bạn gặp sự cố tra cứu tài liệu.</span>
                    </div>
                </div>
            </div>

            <!-- Bottom Copyright Bar -->
            <div class="pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 fs-8" style="color: #94a3b8;">
                <div>
                    &copy; 2026 LibraryHub Enterprise Management System. Tất cả quyền được bảo lưu.
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span>Phát triển bằng Vue 3 & Node.js Express</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { Library, MapPin, Phone, Mail, Clock } from 'lucide-vue-next';
</script>

<style scoped>
.max-w-7xl { max-width: 1280px; }

.footer-link {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.15s ease;
}

.footer-link:hover {
    color: #ffffff;
}

.bg-slate-950 {
    background-color: #020617;
}
</style>
