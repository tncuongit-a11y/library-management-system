import api from './api.service';

class BorrowService {
    async getAll(params) { return await api.get('/borrows', { params }); }
    async create(data) { return await api.post('/borrows', data); }
    async returnBook(id) { return await api.put(`/borrows/${id}/return`); }
    async extendBorrow(id) { return await api.put(`/borrows/${id}/extend`); }
    async createOnlineRequest(data) { return await api.post('/borrows/online-request', data); }
    async processOnlineRequest(id, action) { return await api.put(`/borrows/${id}/process-request`, { action }); }
    async lookupReaderHistory(search) { return await api.get('/borrows/reader-lookup', { params: { search } }); }
}
export default new BorrowService();