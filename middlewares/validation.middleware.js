const Student = require('../models/student.model');

module.exports = (req, res, next) => {
    const isPartial = req.method === 'PUT' || req.method === 'PATCH';
    const errors = Student.validate(req.body, isPartial);

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    next();
};
