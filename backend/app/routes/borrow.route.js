const express = require('express');
const { body } = require('express-validator');
const borrowController = require('../controllers/borrow.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// Public routes for Readers
router.post('/online-request', [
    body('sachId').isMongoId().withMessage('ID sách không hợp lệ'),
    body('dienThoai').notEmpty().withMessage('Số điện thoại là bắt buộc')
], validate, borrowController.createOnlineRequest);

router.get('/reader-lookup', borrowController.getReaderHistory);

// Protected Staff routes
router.use(verifyToken);

const borrowValidations = [
    body('docGia').isMongoId().withMessage('Độc giả không hợp lệ'),
    body('sach').isMongoId().withMessage('Sách không hợp lệ')
];

router.post('/', borrowValidations, validate, borrowController.create);
router.get('/', borrowController.getAll);
router.put('/:id/return', borrowController.returnBook);
router.put('/:id/extend', borrowController.extendBorrow);
router.put('/:id/process-request', borrowController.processOnlineRequest);

module.exports = router;