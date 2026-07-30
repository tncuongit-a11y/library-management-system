import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import DefaultLayout from "../layouts/DefaultLayout.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/reader-portal",
    name: "ReaderPortal",
    component: () => import("../views/ReaderPortal.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    component: DefaultLayout,
    meta: { requiresAuth: true }, // Các children bên trong sẽ kế thừa thuộc tính này
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("../views/Dashboard.vue"),
      },
      {
        path: "/books",
        name: "BookList",
        component: () => import("../views/Book/BookList.vue"),
      },
      {
        path: "/books/add",
        name: "BookAdd",
        component: () => import("../views/Book/BookForm.vue"),
      },
      {
        path: "/books/edit/:id",
        name: "BookEdit",
        component: () => import("../views/Book/BookForm.vue"),
      },
      {
        path: "/readers",
        name: "ReaderList",
        component: () => import("../views/Reader/ReaderList.vue"),
      },
      {
        path: "/readers/add",
        name: "ReaderAdd",
        component: () => import("../views/Reader/ReaderForm.vue"),
      },
      {
        path: "/readers/edit/:id",
        name: "ReaderEdit",
        component: () => import("../views/Reader/ReaderForm.vue"),
      },
      {
        path: "/publishers",
        name: "PublisherList",
        component: () => import("../views/Publisher/PublisherList.vue"),
      },
      {
        path: "/publishers/add",
        name: "PublisherAdd",
        component: () => import("../views/Publisher/PublisherForm.vue"),
      },
      {
        path: "/publishers/edit/:id",
        name: "PublisherEdit",
        component: () => import("../views/Publisher/PublisherForm.vue"),
      },
      {
        path: "/borrows",
        name: "BorrowList",
        component: () => import("../views/Borrow/BorrowList.vue"),
      },
      {
        path: "/borrows/add",
        name: "BorrowAdd",
        component: () => import("../views/Borrow/BorrowForm.vue"),
      },
      
      // --- KHU VỰC QUẢN LÝ NHÂN VIÊN ĐÃ ĐƯỢC GỘP VÀ THÊM META BẢO MẬT ---
      {
        path: "/staffs",
        name: "StaffList",
        // Lưu ý: Dùng StaffList.vue hoặc StaffView.vue tùy theo file nào của bạn đang chứa bảng nhân viên
        component: () => import("../views/Staff/StaffList.vue"), 
        meta: { requiresAdmin: true },
      },
      {
        path: "/staffs/add",
        name: "StaffAdd",
        component: () => import("../views/Staff/StaffForm.vue"),
        meta: { requiresAdmin: true },
      },
      {
        path: "/staffs/edit/:id",
        name: "StaffEdit",
        component: () => import("../views/Staff/StaffForm.vue"),
        meta: { requiresAdmin: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- GOM LẠI THÀNH MỘT GLOBAL GUARD DUY NHẤT ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // 1. Nếu route yêu cầu đăng nhập mà user chưa đăng nhập -> Đẩy về trang Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  // 2. Nếu đã đăng nhập rồi mà cố tình vào lại trang Login -> Đẩy về Dashboard
  if (to.name === "Login" && isAuthenticated) {
    return next({ name: "Dashboard" });
  }

  // 3. Nếu route yêu cầu đặc quyền Admin (Quản trị viên)
  if (to.meta.requiresAdmin) {
    // Kiểm tra tài khoản có thỏa mãn không
    if (!isAuthenticated || authStore.user?.chucVu !== 'Quản lý') {
      alert('Từ chối truy cập: Bạn không có quyền quản trị để vào trang này!');
    // alert('Dữ liệu User hiện tại là: ' + JSON.stringify(authStore.user));
      return next({ path: '/' }); // Đẩy về trang chủ (hoặc '/dashboard' tùy ý bạn)
    }
  }

  // 4. Các trường hợp hợp lệ khác -> Cho qua bình thường
  next();
});

export default router;