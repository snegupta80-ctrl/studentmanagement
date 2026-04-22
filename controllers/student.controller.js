const studentService = require('../services/student.service');

exports.createStudent = async (req, res, next) => {
    try {
        const student = await studentService.createStudent(req.body);
        res.status(201).json(student);
    } catch (err) {
        next(err);
    }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const result = await studentService.getAllStudents(req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getStudent = async (req, res, next) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        res.status(200).json(student);
    } catch (err) {
        next(err);
    }
};

exports.updateStudent = async (req, res, next) => {
    try {
        const updated = await studentService.updateStudent(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteStudent = async (req, res, next) => {
    try {
        const deleted = await studentService.deleteStudent(req.params.id);
        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
};
