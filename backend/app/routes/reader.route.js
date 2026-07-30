const express = require('express');
const { body } = require('express-validator');
const readerController = require('../controllers/reader.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(verifyToken);

const readerValidations = [
    body('maDocGia').notEmpty().withMessage('Mã độc giả không được trống'),
    body('hoLot').notEmpty().withMessage('Họ lót không được trống'),
    body('ten').notEmpty().withMessage('Tên không được trống'),
    body('dienThoai').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
    body('ngaySinh').isISO8601().toDate().withMessage('Ngày sinh không hợp lệ')
];

router.post('/', readerValidations, validate, readerController.create);
router.get('/', readerController.getAll);
router.get('/:id', readerController.getById);
router.put('/:id', readerValidations, validate, readerController.update);
router.delete('/:id', readerController.delete);

module.exports = router;