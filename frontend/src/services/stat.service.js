import api from './api.service';

class StatService {
    async getDashboardStats() {
        return await api.get('/stats/dashboard');
    }
}

export default new StatService();