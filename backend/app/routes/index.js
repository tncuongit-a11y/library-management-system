const express = require('express');
const authRoutes = require('./auth.route');
const publisherRoutes = require('./publisher.route');
const readerRoutes = require('./reader.route');
const bookRoutes = require('./book.route');
const staffRoutes = require('./staff.route');
const borrowRoutes = require('./borrow.route');
const statRoutes = require('./stat.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/publishers', publisherRoutes);
router.use('/readers', readerRoutes);
router.use('/books', bookRoutes);
router.use('/staffs', staffRoutes);
router.use('/borrows', borrowRoutes);
router.use('/stats', statRoutes);

module.exports = router;