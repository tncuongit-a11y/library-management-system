const publisherService = require('../services/publisher.service');

exports.create = async (req, res, next) => {
    try {
        const publisher = await publisherService.create(req.body);
        res.status(201).json({ success: true, message: 'Thêm NXB thành công', data: publisher });
    } catch (error) { next(error); }
};

exports.getAll = async (req, res, next) => {
    try {
        const result = await publisherService.getAll(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const publisher = await publisherService.getById(req.params.id);
        res.status(200).json({ success: true, data: publisher });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const publisher = await publisherService.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật NXB thành công', data: publisher });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        await publisherService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa NXB thành công' });
    } catch (error) { next(error); }
};