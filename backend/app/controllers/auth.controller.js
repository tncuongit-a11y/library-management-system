const authService = require('../services/auth.service');

exports.login = async (req, res, next) => {
    try {
        const { msnv, password } = req.body;
        
        if (!msnv || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mã số nhân viên và mật khẩu'
            });
        }

        const data = await authService.login(msnv, password);
        
        res.status(200).json({
            success: true,
            message: 'Đăng nhập nhân viên thành công',
            data
        });
    } catch (error) {
        next(error);
    }
};

exports.readerRegister = async (req, res, next) => {
    try {
        const data = await authService.readerRegister(req.body);
        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản độc giả thành công',
            data
        });
    } catch (error) {
        next(error);
    }
};

exports.readerLogin = async (req, res, next) => {
    try {
        const { account, password } = req.body;
        if (!account || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tài khoản (SĐT/Mã ĐG) và mật khẩu'
            });
        }
        const data = await authService.readerLogin(account, password);
        res.status(200).json({
            success: true,
            message: 'Đăng nhập độc giả thành công',
            data
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: { user: req.user }
        });
    } catch (error) {
        next(error);
    }
};