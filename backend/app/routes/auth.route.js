const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/reader/register', authController.readerRegister);
router.post('/reader/login', authController.readerLogin);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;