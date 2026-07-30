import api from './api.service';

class PublisherService {
    async getAll(params) { return await api.get('/publishers', { params }); }
    async get(id) { return await api.get(`/publishers/${id}`); }
    async create(data) { return await api.post('/publishers', data); }
    async update(id, data) { return await api.put(`/publishers/${id}`, data); }
    async delete(id) { return await api.delete(`/publishers/${id}`); }
}
export default new PublisherService();