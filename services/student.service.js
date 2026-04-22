const Student = require('../models/student.model');
const mongoose = require('mongoose');

// Import io instance for emitting real-time events
let io;
const getIO = () => {
    if (!io) {
        const serverModule = require('../server');
        io = serverModule.io;
    }
    return io;
};

exports.createStudent = async (data) => {
    const student = await Student.create(data);
    
    // Emit real-time event
    const ioInstance = getIO();
    if (ioInstance) {
        ioInstance.emit('studentCreated', student);
    }
    
    return student;
};

exports.getAllStudents = async ({ page = 1, limit = 5, search = '' }) => {
    const query = search
        ? { name: { $regex: search, $options: 'i' } }
        : {};

    const skip = (page - 1) * limit;

    const students = await Student.find(query)
        .skip(skip)
        .limit(Number(limit));

    const total = await Student.countDocuments(query);

    return {
        total,
        page: Number(page),
        data: students
    };
};

exports.getStudentById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { status: 400, message: 'Invalid ID format' };
    }

    const student = await Student.findById(id);

    if (!student) {
        throw { status: 404, message: 'Student not found' };
    }

    return student;
};

exports.updateStudent = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { status: 400, message: 'Invalid ID format' };
    }

    const updated = await Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });

    if (!updated) {
        throw { status: 404, message: 'Student not found' };
    }

    // Emit real-time event
    const ioInstance = getIO();
    if (ioInstance) {
        ioInstance.emit('studentUpdated', updated);
    }

    return updated;
};

exports.deleteStudent = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { status: 400, message: 'Invalid ID format' };
    }

    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
        throw { status: 404, message: 'Student not found' };
    }

    // Emit real-time event
    const ioInstance = getIO();
    if (ioInstance) {
        ioInstance.emit('studentDeleted', { id, deletedStudent: deleted });
    }

    return deleted;
};
