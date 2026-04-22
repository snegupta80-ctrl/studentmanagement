const Student = require('../models/student.model');
const { generateId } = require('../utils/idGenerator');

let students = []; // In-memory storage

exports.createStudent = (data) => {
    const errors = Student.validate(data);
    if (errors.length) {
        throw { status: 400, message: errors };
    }

    const student = new Student({
        id: generateId(),
        ...data
    });

    students.push(student);
    return student;
};

exports.getAllStudents = ({ page = 1, limit = 5, search = '' }) => {
    let filtered = students;

    if (search) {
        filtered = students.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
        total: filtered.length,
        page,
        data: paginated
    };
};

exports.getStudentById = (id) => {
    const student = students.find(s => s.id === id);
    if (!student) {
        throw { status: 404, message: 'Student not found' };
    }
    return student;
};

exports.updateStudent = (id, data) => {
    const student = students.find(s => s.id === id);

    if (!student) {
        throw { status: 404, message: 'Student not found' };
    }

    Object.assign(student, data);
    return student;
};

exports.deleteStudent = (id) => {
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        throw { status: 404, message: 'Student not found' };
    }

    const deleted = students.splice(index, 1);
    return deleted[0];
};
