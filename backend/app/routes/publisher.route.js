const express = require('express');
const { body } = require('express-validator');
const publisherController = require('../controllers/publisher.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// Public routes for readers
router.get('/', publisherController.getAll);
router.get('/:id', publisherController.getById);

// Protected Staff routes
router.use(verifyToken);

const publisherValidations = [
    body('maNXB').notEmpty().withMessage('Mã NXB không được để trống'),
    body('tenNXB').notEmpty().withMessage('Tên NXB không được để trống'),
    body('diaChi').notEmpty().withMessage('Địa chỉ không được để trống')
];

router.post('/', publisherValidations, validate, publisherController.create);
router.put('/:id', publisherValidations, validate, publisherController.update);
router.delete('/:id', publisherController.delete);

module.exports = router;