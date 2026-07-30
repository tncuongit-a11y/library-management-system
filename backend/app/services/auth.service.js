const Staff = require('../models/staff.model');
const Reader = require('../models/reader.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/api-error');

class AuthService {
    async login(msnv, password) {
        const staff = await Staff.findOne({ msnv });
        if (!staff) {
            throw new ApiError(401, 'Mã số nhân viên hoặc mật khẩu không đúng');
        }

        const isPasswordMatch = await staff.comparePassword(password);
        if (!isPasswordMatch) {
            throw new ApiError(401, 'Mã số nhân viên hoặc mật khẩu không đúng');
        }

        // Tạo JWT Token
        const payload = {
            id: staff._id,
            msnv: staff.msnv,
            chucVu: staff.chucVu,
            role: 'STAFF'
        };

        const token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });

        return {
            token,
            user: {
                id: staff._id,
                msnv: staff.msnv,
                hoTen: staff.hoTen,
                chucVu: staff.chucVu,
                role: 'STAFF'
            }
        };
    }

    async readerRegister(data) {
        const { hoLot, ten, dienThoai, diaChi, ngaySinh, phai, matKhau, email } = data;

        // Check if phone or email already registered
        const existingReader = await Reader.findOne({ dienThoai });
        if (existingReader) {
            throw new ApiError(400, 'Số điện thoại này đã được đăng ký tài khoản.');
        }

        // Auto generate maDocGia
        const count = await Reader.countDocuments();
        const maDocGia = `DG${String(count + 1).padStart(4, '0')}`;

        const reader = new Reader({
            maDocGia,
            hoLot,
            ten,
            dienThoai,
            diaChi: diaChi || 'Chưa cập nhật',
            ngaySinh: ngaySinh ? new Date(ngaySinh) : new Date('2000-01-01'),
            phai: phai || 'Khác',
            email: email || '',
            matKhau
        });

        await reader.save();

        const payload = {
            id: reader._id,
            maDocGia: reader.maDocGia,
            role: 'READER'
        };

        const token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });

        return {
            token,
            user: {
                id: reader._id,
                maDocGia: reader.maDocGia,
                hoTen: `${reader.hoLot} ${reader.ten}`,
                dienThoai: reader.dienThoai,
                email: reader.email,
                role: 'READER'
            }
        };
    }

    async readerLogin(account, password) {
        // account can be dienThoai or maDocGia
        const reader = await Reader.findOne({
            $or: [{ dienThoai: account }, { maDocGia: account }, { email: account }]
        }).select('+matKhau');

        if (!reader || !reader.matKhau) {
            throw new ApiError(401, 'Số điện thoại / Mã độc giả hoặc mật khẩu không chính xác');
        }

        const isMatch = await reader.comparePassword(password);
        if (!isMatch) {
            throw new ApiError(401, 'Số điện thoại / Mã độc giả hoặc mật khẩu không chính xác');
        }

        const payload = {
            id: reader._id,
            maDocGia: reader.maDocGia,
            role: 'READER'
        };

        const token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });

        return {
            token,
            user: {
                id: reader._id,
                maDocGia: reader.maDocGia,
                hoTen: `${reader.hoLot} ${reader.ten}`,
                hoLot: reader.hoLot,
                ten: reader.ten,
                dienThoai: reader.dienThoai,
                diaChi: reader.diaChi,
                email: reader.email,
                role: 'READER'
            }
        };
    }
}

module.exports = new AuthService();