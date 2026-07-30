const express = require('express');
const { body } = require('express-validator');
const bookController = require('../controllers/book.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// Public routes for all visitors & readers
router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.post('/:id/review', [
    body('diem').isInt({ min: 1, max: 5 }).withMessage('Điểm đánh giá từ 1 đến 5 sao')
], validate, bookController.addReview);

// Protected Staff routes
router.use(verifyToken);

const bookValidations = [
    body('maSach').notEmpty().withMessage('Mã sách không được trống'),
    body('tenSach').notEmpty().withMessage('Tên sách không được trống'),
    body('donGia').isNumeric().withMessage('Đơn giá phải là số'),
    body('soQuyen').isInt({ min: 0 }).withMessage('Số quyển phải là số nguyên >= 0'),
    body('namXuatBan').isInt().withMessage('Năm xuất bản không hợp lệ'),
    body('tacGia').notEmpty().withMessage('Tác giả không được trống'),
    body('nhaXuatBan').isMongoId().withMessage('Nhà xuất bản không hợp lệ (Phải là ObjectId)')
];

router.post('/', bookValidations, validate, bookController.create);
router.put('/:id', bookValidations, validate, bookController.update);
router.delete('/:id', bookController.delete);

module.exports = router;