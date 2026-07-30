const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', routes);

// Serve frontend static build files in production/integrated mode
const frontendDistPath = path.join(process.cwd(), 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.get(/(.*)/, (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        const indexPath = path.join(frontendDistPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            return res.sendFile(indexPath);
        }
        next();
    });
}

// Handle 404 & Errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;