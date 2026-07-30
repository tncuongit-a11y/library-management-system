const ApiError = require('../utils/api-error');

const notFound = (req, res, next) => {
    return next(new ApiError(404, 'Resource not found'));
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (
        err.name === 'MongooseError' ||
        err.name === 'MongoNetworkError' ||
        err.name === 'MongoServerSelectionError' ||
        err.name === 'MongoTimeoutError' ||
        (err.message && err.message.includes('buffering timed out'))
    ) {
        statusCode = 503;
        message = 'Database service unavailable or disconnected.';
        if (req.method === 'GET') {
            return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
        }
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        // Chỉ hiển thị stack trace trong môi trường development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = { notFound, errorHandler };