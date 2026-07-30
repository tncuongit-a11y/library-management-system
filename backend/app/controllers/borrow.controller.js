const borrowService = require('../services/borrow.service');

exports.create = async (req, res, next) => {
    try {
        const borrow = await borrowService.createBorrow(req.body);
        res.status(201).json({ success: true, message: 'Tạo phiếu mượn thành công', data: borrow });
    } catch (error) { next(error); }
};

exports.returnBook = async (req, res, next) => {
    try {
        const borrow = await borrowService.returnBook(req.params.id);
        res.status(200).json({ success: true, message: 'Trả sách thành công', data: borrow });
    } catch (error) { next(error); }
};

exports.extendBorrow = async (req, res, next) => {
    try {
        const borrow = await borrowService.extendBorrow(req.params.id);
        res.status(200).json({ success: true, message: 'Gia hạn mượn sách thành công (+7 ngày)', data: borrow });
    } catch (error) { next(error); }
};

exports.createOnlineRequest = async (req, res, next) => {
    try {
        const result = await borrowService.createOnlineRequest(req.body);
        res.status(201).json({ success: true, message: 'Đăng ký mượn sách trực tuyến thành công! Vui lòng chờ thư viện phê duyệt.', data: result });
    } catch (error) { next(error); }
};

exports.processOnlineRequest = async (req, res, next) => {
    try {
        const { action } = req.body;
        const result = await borrowService.processOnlineRequest(req.params.id, action);
        const msg = action === 'approve' ? 'Đã duyệt yêu cầu mượn sách' : 'Đã từ chối yêu cầu mượn sách';
        res.status(200).json({ success: true, message: msg, data: result });
    } catch (error) { next(error); }
};

exports.getReaderHistory = async (req, res, next) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Số điện thoại hoặc Mã độc giả' });
        }
        const result = await borrowService.getReaderHistory(search);
        res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
};

exports.getAll = async (req, res, next) => {
    try {
        const result = await borrowService.getAll(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
};