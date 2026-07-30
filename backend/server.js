const app = require('./app/app');
const config = require('./app/config');
const mongoose = require('mongoose');
const seedData = require('./app/utils/seed');

mongoose.set('bufferCommands', false);

async function startServer() {
    let connected = false;

    if (process.env.MONGODB_URI) {
        try {
            console.log('Attempting MongoDB connection to:', process.env.MONGODB_URI);
            await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
            console.log('Connected to external MongoDB successfully!');
            connected = true;
        } catch (error) {
            console.warn('[AI Studio] External MongoDB connection error:', error.message);
        }
    }

    if (!connected) {
        try {
            console.log('Attempting MongoDB connection to default URI:', config.db.uri);
            await mongoose.connect(config.db.uri, { serverSelectionTimeoutMS: 3000 });
            console.log('Connected to MongoDB successfully!');
            connected = true;
        } catch (error) {
            console.warn('[AI Studio] Default MongoDB connection error:', error.message);
        }
    }

    if (!connected) {
        try {
            console.log('Starting in-memory MongoDB server (MongoMemoryServer)...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('Connected to MongoMemoryServer successfully!');
            connected = true;
        } catch (error) {
            console.warn('[AI Studio] MongoMemoryServer error:', error.message);
        }
    }

    if (connected) {
        await seedData();
    } else {
        console.warn('[AI Studio] Server started without active database connection.');
    }

    const PORT = 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
}

startServer();

