const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/api-error');
const Staff = require('../models/staff.model');
const Reader = require('../models/reader.model');

const verifyToken = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new ApiError(401, 'Bạn chưa đăng nhập. Vui lòng cung cấp token.'));
        }

        const decoded = jwt.verify(token, config.jwt.secret);

        if (decoded.role === 'READER') {
            const currentReader = await Reader.findById(decoded.id);
            if (!currentReader) {
                return next(new ApiError(401, 'Tài khoản độc giả sở hữu token này không còn tồn tại.'));
            }
            req.user = {
                id: currentReader._id,
                maDocGia: currentReader.maDocGia,
                hoTen: `${currentReader.hoLot} ${currentReader.ten}`,
                dienThoai: currentReader.dienThoai,
                role: 'READER'
            };
            return next();
        }
        
        const currentUser = await Staff.findById(decoded.id).select('-password');
        if (!currentUser) {
            return next(new ApiError(401, 'Nhân viên sở hữu token này không còn tồn tại.'));
        }

        req.user = currentUser;
        req.user.role = 'STAFF';
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ApiError(401, 'Token đã hết hạn. Vui lòng đăng nhập lại.'));
        }
        return next(new ApiError(401, 'Token không hợp lệ.'));
    }
};

const verifyAdmin = (req, res, next) => {
    // Thông thường, hàm verifyToken ở bước trước đã giải mã và gán thông tin user vào req.user
    // Thay 'Quản trị viên' bằng giá trị chức vụ/quyền hạn thực tế bạn lưu trong MongoDB
    if (req.user && req.user.chucVu === 'Quản lý') {
        next(); // Hợp lệ, cho phép đi tiếp vào Controller
    } else {
        // Sử dụng ApiError để đồng bộ cấu trúc lỗi toàn hệ thống
        return next(new ApiError(403, 'Từ chối truy cập: API này chỉ dành cho Quản trị viên!'));
    }
};

// Gom chung export vào một dòng duy nhất ở cuối file
module.exports = { verifyToken, verifyAdmin };