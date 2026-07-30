const staffService = require('../services/staff.service');

exports.create = async (req, res, next) => {
    try {
        const staff = await staffService.create(req.body);
        const { password, ...staffInfo } = staff.toObject();
        res.status(201).json({ success: true, message: 'Thêm nhân viên thành công', data: staffInfo });
    } catch (error) { next(error); }
};

exports.getAll = async (req, res, next) => {
    try {
        const result = await staffService.getAll(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const staff = await staffService.getById(req.params.id);
        res.status(200).json({ success: true, data: staff });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const staff = await staffService.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật nhân viên thành công', data: staff });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        await staffService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa nhân viên thành công' });
    } catch (error) { next(error); }
};