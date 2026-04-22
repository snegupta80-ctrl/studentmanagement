const express = require('express');
const controller = require('../controllers/student.controller');
const validate = require('../middlewares/validation.middleware');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.post('/', validate, controller.createStudent);
router.get('/', controller.getAllStudents);
router.get('/:id', controller.getStudent);
router.put('/:id', validate, controller.updateStudent);
router.delete('/:id', controller.deleteStudent);

module.exports = router;
