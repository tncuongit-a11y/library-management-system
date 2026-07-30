const Reader = require('../models/reader.model');
const ApiError = require('../utils/api-error');

class ReaderService {
    async create(data) {
        const isExist = await Reader.findOne({ maDocGia: data.maDocGia });
        if (isExist) throw new ApiError(400, 'Mã độc giả đã tồn tại');
        return await Reader.create(data);
    }

    async getAll(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const filter = {};
        
        if (search) {
            // Tìm kiếm theo tên hoặc số điện thoại
            filter.$or = [
                { ten: { $regex: search, $options: 'i' } },
                { hoLot: { $regex: search, $options: 'i' } },
                { dienThoai: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const [readers, total] = await Promise.all([
            Reader.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            Reader.countDocuments(filter)
        ]);

        return {
            data: readers,
            pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
        };
    }

    async getById(id) {
        const reader = await Reader.findById(id);
        if (!reader) throw new ApiError(404, 'Không tìm thấy độc giả');
        return reader;
    }

    async update(id, data) {
        const reader = await Reader.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!reader) throw new ApiError(404, 'Không tìm thấy độc giả');
        return reader;
    }

    async delete(id) {
        const reader = await Reader.findByIdAndDelete(id);
        if (!reader) throw new ApiError(404, 'Không tìm thấy độc giả');
        return true;
    }
}
module.exports = new ReaderService();