const express = require('express');
const { body } = require('express-validator');
const staffController = require('../controllers/staff.controller');
const { verifyToken, verifyAdmin} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(verifyToken);
router.use(verifyAdmin);

const staffValidations = [
    body('msnv').notEmpty().withMessage('Mã số nhân viên không được trống'),
    body('hoTen').notEmpty().withMessage('Họ tên không được trống'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu ít nhất 6 ký tự'),
    body('diaChi').notEmpty().withMessage('Địa chỉ không được trống'),
    body('soDienThoai').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ')
];

router.post('/', staffValidations, validate, staffController.create);
router.get('/', staffController.getAll);
router.get('/:id', staffController.getById);
router.put('/:id', staffController.update); // Bỏ validation bắt buộc password để update được các trường khác
router.delete('/:id', staffController.delete);

module.exports = router;