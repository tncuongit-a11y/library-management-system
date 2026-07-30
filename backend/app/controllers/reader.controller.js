const readerService = require('../services/reader.service');

exports.create = async (req, res, next) => {
    try {
        const reader = await readerService.create(req.body);
        res.status(201).json({ success: true, message: 'Thêm độc giả thành công', data: reader });
    } catch (error) { next(error); }
};

exports.getAll = async (req, res, next) => {
    try {
        const result = await readerService.getAll(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const reader = await readerService.getById(req.params.id);
        res.status(200).json({ success: true, data: reader });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const reader = await readerService.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật độc giả thành công', data: reader });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        await readerService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa độc giả thành công' });
    } catch (error) { next(error); }
};