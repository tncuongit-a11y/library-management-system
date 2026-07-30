import api from './api.service';

class StaffService {
    async getAll(params) { return await api.get('/staffs', { params }); }
    async get(id) { return await api.get(`/staffs/${id}`); }
    async create(data) { return await api.post('/staffs', data); }
    async update(id, data) { return await api.put(`/staffs/${id}`, data); }
    async delete(id) { return await api.delete(`/staffs/${id}`); }
}
export default new StaffService();