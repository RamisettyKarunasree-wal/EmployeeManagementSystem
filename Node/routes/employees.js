const Employee = require('../models').Employee;
const { body, validationResult, param } = require('express-validator');
const Department = require('../models').Department;
const Manager = require('../models').Manager;
const express = require('express');
const router = express.Router();
const multer = require('multer');
var uniquename = null;
const {
  getEmployees,
  getEmployee,
  deleteEmployees,
  deleteEmployee,
} = require('../controllers/employees');
const authentication = require('../middlewares/authentication');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    console.log(file);
    uniquename = Date.now() + '-' + file.originalname;
    cb(null, uniquename);
  },
});
const upload = multer({
  storage: storage,
  limits: { fieldNameSize: 1000, fileSize: 102400000 },
  fileFilter: (req, file, cb) => {
    console.log('File filter running..');
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png .jpg and .jpeg are allowed'));
    }
  },
});
router.post(
  '/',
  authentication,
  upload.single('image'),
  body('firstname')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('firstname should not be empty')
    .isAlpha()
    .withMessage('firstname should contain only alphabet')
    .isLength({ min: 5 })
    .withMessage('firstname should have greater than 4 characters'),
  body('lastname')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('lastname should not be empty')
    .isAlpha()
    .withMessage('lastname should contain only alphabet')
    .isLength({ min: 5 })
    .withMessage('lastname should have greater than 4 characters'),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('email should not be empty')
    .isEmail()
    .withMessage('invalid email format'),
  body('gender')
    .notEmpty()
    .withMessage('Gender should not be empty')
    .custom((value) => {
      const gender = ['Male', 'Female'];
      if (!gender.includes(value)) {
        throw new Error('select the correct gender [Male,Female]');
      }
      return true;
    }),
  body('phone')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('phone number should not be empty')
    .isNumeric()
    .withMessage('Phone number should contain only digits')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number should have 10 digits'),
  body('address')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('address should not be empty')
    .isLength({ min: 5 })
    .withMessage('address should have greater than 4 characters'),
  body('department')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('department should not be empty')
    .isNumeric()
    .withMessage('department should contain only digits'),
  body('hire_date')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('hire_date should not be empty')
    .isDate()
    .withMessage('hire_date should be a date'),
  body('status')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('status should not be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors, msg: 'validation error' });
    } else {
      const {
        firstname,
        lastname,
        email,
        phone,
        gender,
        hire_date,
        address,
        department,
        status,
      } = req.body;
      try {
        const employee = await Employee.findOne({ where: { email } });
        if (employee) {
          res
            .status(400)
            .json({ msg: 'Employee with the given email already existed' });
        } else {
          await Employee.create({
            firstname,
            lastname,
            email,
            phone,
            gender,
            status,
            hire_date,
            address,
            department,
            image: `/uploads/${uniquename}`,
          });
          res.status(200).json({
            msg: 'added employee successfully',
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'internal error occured,check console' });
      }
    }
  }
);
router.put(
  '/:id',
  authentication,
  upload.single('image'),
  body('firstname')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('firstname should not be empty')
    .isAlpha()
    .withMessage('firstname should contain only alphabet')
    .isLength({ min: 5 })
    .withMessage('firstname should have greater than 4 characters'),
  body('lastname')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('lastname should not be empty')
    .isAlpha()
    .withMessage('lastname should contain only alphabet')
    .isLength({ min: 5 })
    .withMessage('lastname should have greater than 4 characters'),
  body('gender')
    .notEmpty()
    .withMessage('Gender should not be empty')
    .custom((value) => {
      const gender = ['Male', 'Female'];
      if (!gender.includes(value)) {
        throw new Error('select the correct gender [Male,Female]');
      }
      return true;
    }),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('email should not be empty')
    .isEmail()
    .withMessage('invalid email format'),
  body('phone')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('phone number should not be empty')
    .isNumeric()
    .withMessage('Phone number should contain only digits')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number should have 10 digits'),
  body('address')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('address should not be empty')
    .isLength({ min: 5 })
    .withMessage('address should have greater than 4 characters'),
  body('department')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('department should not be empty')
    .isNumeric()
    .withMessage('department should contain only digits'),
  body('status')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('status should not be empty'),
  param('id')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('id in params is empty')
    .isNumeric()
    .withMessage('id in params should be a number'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors, msg: 'validation error' });
    } else {
      const {
        firstname,
        lastname,
        email,
        phone,
        gender,
        hire_date,
        address,
        department,
        status,
      } = req.body;
      try {
        const employee = await Employee.findOne({
          where: { id: req.params.id },
          include: [
            {
              model: Department,
              include: [{ model: Manager }],
            },
          ],
        });
        if (!employee) {
          res.status(400).json({
            msg: `Employee with id ${req.params.id} not Found`,
          });
        } else {
          const duplicateEmployee = await Employee.findOne({
            where: { email },
          });
          if (
            duplicateEmployee &&
            Number(duplicateEmployee.id) !== Number(req.params.id)
          ) {
            res
              .status(400)
              .json({ msg: 'Employee with the given email already existed' });
          } else {
            await Employee.update(
              {
                firstname,
                lastname,
                email,
                phone,
                gender,
                hire_date,
                address,
                department,
                status,
              },
              { where: { id: req.params.id } }
            );
            if (!req.body.image) {
              await Employee.update(
                {
                  image: `/uploads/${uniquename}`,
                },
                { where: { id: req.params.id } }
              );
            }
            res.status(200).json({
              msg: 'updated employee details successfully',
            });
          }
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ error: 'internal error occured , check console' });
      }
    }
  }
);
router.get('/', authentication, getEmployees);
router.get('/:id',authentication, getEmployee);
router.delete('/',authentication, deleteEmployees);
router.delete('/:id',authentication, deleteEmployee);
module.exports = router;
