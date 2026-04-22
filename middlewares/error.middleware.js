module.exports = (err, req, res, next) => {
    console.error(err);
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = 'Invalid ID format';
        status = 400;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        message = 'Duplicate field value entered';
        status = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        message = errors;
        status = 400;
    }

    res.status(status).json({ error: message });
};
