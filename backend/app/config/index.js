require('dotenv').config();

const config = {
    app: {
        port: 3000,
    },
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_db'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
};

module.exports = config;