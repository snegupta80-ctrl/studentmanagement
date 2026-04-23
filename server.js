require('dotenv').config();
const http = require('http');
const app = require('./app');
const config = require('./config/app.config');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const logger = require('./utils/logger');

// Connect to MongoDB
connectDB();

// Create HTTP server (shared for Express and Socket.IO)
const server = http.createServer(app);

// CORS origins for Socket.IO (must match HTTP CORS)
const socketOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://localhost',
    'http://localhost:80',
    'http://127.0.0.1'
];
if (process.env.CLIENT_URL) {
    socketOrigins.push(process.env.CLIENT_URL);
}

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: socketOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

// Export io instance for use in other modules
module.exports.io = io;

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
