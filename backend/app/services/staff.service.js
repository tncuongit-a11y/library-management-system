const Staff = require('../models/staff.model');
const ApiError = require('../utils/api-error');

class StaffService {
    async create(data) {
        const isExist = await Staff.findOne({ msnv: data.msnv });
        if (isExist) throw new ApiError(400, 'Mã số nhân viên đã tồn tại');
        return await Staff.create(data);
    }

    async getAll(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const filter = search ? { hoTen: { $regex: search, $options: 'i' } } : {};
        
        const skip = (page - 1) * limit;
        const [staffs, total] = await Promise.all([
            // Bỏ trường password khi trả về danh sách
            Staff.find(filter).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            Staff.countDocuments(filter)
        ]);

        return {
            data: staffs,
            pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
        };
    }

    async getById(id) {
        const staff = await Staff.findById(id).select('-password');
        if (!staff) throw new ApiError(404, 'Không tìm thấy nhân viên');
        return staff;
    }

    async update(id, data) {
        const staff = await Staff.findById(id);
        if (!staff) throw new ApiError(404, 'Không tìm thấy nhân viên');

        // Cập nhật các trường
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== '') {
                staff[key] = data[key];
            }
        });

        await staff.save();
        
        // Không trả về password
        const updatedStaff = staff.toObject();
        delete updatedStaff.password;
        return updatedStaff;
    }

    async delete(id) {
        const staff = await Staff.findByIdAndDelete(id);
        if (!staff) throw new ApiError(404, 'Không tìm thấy nhân viên');
        return true;
    }
}
module.exports = new StaffService();