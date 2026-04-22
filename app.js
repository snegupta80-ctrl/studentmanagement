const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/student.routes');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const notFound = require('./middlewares/notFound.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/students', studentRoutes);

// Not Found
app.use(notFound);

// Error Handler
app.use(errorHandler);

module.exports = app;
