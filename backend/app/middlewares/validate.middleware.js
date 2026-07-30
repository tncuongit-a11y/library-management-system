const { validationResult } = require('express-validator');
const ApiError = require('../utils/api-error');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Lấy thông báo lỗi đầu tiên để trả về
        return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
};

module.exports = { validate };