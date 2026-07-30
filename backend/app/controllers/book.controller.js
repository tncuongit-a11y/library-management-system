const bookService = require('../services/book.service');

exports.create = async (req, res, next) => {
    try {
        const book = await bookService.create(req.body);
        res.status(201).json({ success: true, message: 'Thêm sách thành công', data: book });
    } catch (error) { next(error); }
};

exports.getAll = async (req, res, next) => {
    try {
        const result = await bookService.getAll(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const book = await bookService.getById(req.params.id);
        res.status(200).json({ success: true, data: book });
    } catch (error) { next(error); }
};

exports.addReview = async (req, res, next) => {
    try {
        const book = await bookService.addReview(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Đã gửi đánh giá thành công', data: book });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const book = await bookService.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật sách thành công', data: book });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        await bookService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa sách thành công' });
    } catch (error) { next(error); }
};