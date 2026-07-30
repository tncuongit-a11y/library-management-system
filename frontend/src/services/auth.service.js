import api from './api.service';

class AuthService {
    async login(msnv, password) {
        return await api.post('/auth/login', { msnv, password });
    }
    async readerLogin(account, password) {
        return await api.post('/auth/reader/login', { account, password });
    }
    async readerRegister(data) {
        return await api.post('/auth/reader/register', data);
    }
}

export default new AuthService();