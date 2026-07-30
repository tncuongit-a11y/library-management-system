const Book = require('../models/book.model');
const ApiError = require('../utils/api-error');

class BookService {
    async create(data) {
        const isExist = await Book.findOne({ maSach: data.maSach });
        if (isExist) throw new ApiError(400, 'Mã sách đã tồn tại');
        return await (await Book.create(data)).populate('nhaXuatBan', 'tenNXB');
    }

    async getAll(query) {
        const { page = 1, limit = 10, search = '', nhaXuatBan = '' } = query;
        const filter = {};
        
        if (search) {
            filter.$or = [
                { tenSach: { $regex: search, $options: 'i' } },
                { tacGia: { $regex: search, $options: 'i' } },
                { maSach: { $regex: search, $options: 'i' } }
            ];
        }

        if (nhaXuatBan) {
            filter.nhaXuatBan = nhaXuatBan;
        }

        const skip = (page - 1) * limit;
        const [books, total] = await Promise.all([
            Book.find(filter)
                .populate('nhaXuatBan', 'tenNXB diaChi')
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 }),
            Book.countDocuments(filter)
        ]);

        return {
            data: books,
            pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
        };
    }

    async addReview(id, { tenDocGia, diem, nhanXet }) {
        const book = await Book.findById(id);
        if (!book) throw new ApiError(404, 'Không tìm thấy sách');

        book.danhGia.push({
            tenDocGia: tenDocGia || 'Độc giả ẩn danh',
            diem: Number(diem),
            nhanXet: nhanXet || ''
        });

        const totalStars = book.danhGia.reduce((sum, r) => sum + r.diem, 0);
        book.diemTrungBinh = Math.round((totalStars / book.danhGia.length) * 10) / 10;

        await book.save();
        return book;
    }

    async getById(id) {
        const book = await Book.findById(id).populate('nhaXuatBan', 'tenNXB diaChi');
        if (!book) throw new ApiError(404, 'Không tìm thấy sách');
        return book;
    }

    async update(id, data) {
        const book = await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('nhaXuatBan', 'tenNXB');
        if (!book) throw new ApiError(404, 'Không tìm thấy sách');
        return book;
    }

    async delete(id) {
        const book = await Book.findByIdAndDelete(id);
        if (!book) throw new ApiError(404, 'Không tìm thấy sách');
        return true;
    }
}
module.exports = new BookService();