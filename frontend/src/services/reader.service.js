import api from './api.service';

class ReaderService {
    async getAll(params) { return await api.get('/readers', { params }); }
    async get(id) { return await api.get(`/readers/${id}`); }
    async create(data) { return await api.post('/readers', data); }
    async update(id, data) { return await api.put(`/readers/${id}`, data); }
    async delete(id) { return await api.delete(`/readers/${id}`); }
}
export default new ReaderService();