import { defineStore } from 'pinia';
import authService from '../services/auth.service';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
        error: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isStaff: (state) => state.user?.role === 'STAFF' || !!state.user?.msnv,
        isReader: (state) => state.user?.role === 'READER' || !!state.user?.maDocGia,
    },
    actions: {
        async login(msnv, password) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await authService.login(msnv, password);
                this.token = response.data.token;
                this.user = response.data.user;

                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        async readerLogin(account, password) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await authService.readerLogin(account, password);
                this.token = response.data.token;
                this.user = response.data.user;

                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        async readerRegister(data) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await authService.readerRegister(data);
                this.token = response.data.token;
                this.user = response.data.user;

                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Đăng ký thất bại';
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});