import api from './api.service';

class BookService {
    async getAll(params) {
        return await api.get('/books', { params });
    }
    async get(id) {
        return await api.get(`/books/${id}`);
    }
    async create(data) {
        return await api.post('/books', data);
    }
    async update(id, data) {
        return await api.put(`/books/${id}`, data);
    }
    async delete(id) {
        return await api.delete(`/books/${id}`);
    }
    async addReview(id, data) {
        return await api.post(`/books/${id}/review`, data);
    }
}
export default new BookService();