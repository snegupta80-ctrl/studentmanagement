class Student {
    constructor({ id, name, age, course, createdAt }) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
        this.createdAt = createdAt || new Date();
    }

    static validate(data, isPartial = false) {
        const errors = [];

        if (!isPartial || data.name !== undefined) {
            if (!data.name || typeof data.name !== 'string') {
                errors.push('Name is required and must be a string');
            }
        }

        if (!isPartial || data.age !== undefined) {
            if (!data.age || typeof data.age !== 'number') {
                errors.push('Age must be a number');
            }
        }

        if (!isPartial || data.course !== undefined) {
            if (!data.course || typeof data.course !== 'string') {
                errors.push('Course is required');
            }
        }

        return errors;
    }
}

module.exports = Student;
