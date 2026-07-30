const express = require('express');
const statController = require('../controllers/stat.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/dashboard', verifyToken, statController.getDashboardStats);

module.exports = router;