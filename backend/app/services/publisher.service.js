const Publisher = require('../models/publisher.model');
const ApiError = require('../utils/api-error');

class PublisherService {
    async create(data) {
        const isExist = await Publisher.findOne({ maNXB: data.maNXB });
        if (isExist) throw new ApiError(400, 'Mã nhà xuất bản đã tồn tại');
        return await Publisher.create(data);
    }

    async getAll(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const filter = search ? { tenNXB: { $regex: search, $options: 'i' } } : {};
        
        const skip = (page - 1) * limit;
        
        const [publishers, total] = await Promise.all([
            Publisher.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            Publisher.countDocuments(filter)
        ]);

        return {
            data: publishers,
            pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
        };
    }

    async getById(id) {
        const publisher = await Publisher.findById(id);
        if (!publisher) throw new ApiError(404, 'Không tìm thấy nhà xuất bản');
        return publisher;
    }

    async update(id, data) {
        const publisher = await Publisher.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!publisher) throw new ApiError(404, 'Không tìm thấy nhà xuất bản');
        return publisher;
    }

    async delete(id) {
        const publisher = await Publisher.findByIdAndDelete(id);
        if (!publisher) throw new ApiError(404, 'Không tìm thấy nhà xuất bản');
        return true;
    }
}
module.exports = new PublisherService();