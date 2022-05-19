const Employee = require('../models').Employee;
const Department = require('../models').Department;
const Manager = require('../models').Manager;
const { param, validationResult } = require('express-validator');
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: Department,
          include: [{ model: Manager }],
        },
      ],
    });
    res.status(200).json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal error occured , check console' });
  }
};
exports.getEmployee = [
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
      res.status(400).json({ errors, msg: 'params validation error' });
    } else {
      try {
        const employee = await Employee.findOne({
          where: { id: req.params.id },
          include: { model: Department, include: { model: Manager } },
        });
        if (employee) {
          res.status(200).json(employee);
        } else {
          res.status(400).json({
            msg: `employee with id ${req.params.id} not found`,
          });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ error: 'internal error occured , check console' });
      }
    }
  },
];
exports.deleteEmployee = [
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
      res.status(400).json(errors);
    } else {
      try {
        const employee = await Employee.findOne({
          where: { id: req.params.id },
        });
        if (employee) {
          await Employee.destroy({ where: { id: req.params.id } });
          res.status(200).json({ msg: 'deleted employee successfully' });
        } else {
          res.status(400).json({
            msg: `employee with id ${req.params.id} not found`,
          });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ error: 'internal error occured , check console' });
      }
    }
  },
];
exports.deleteEmployees = async (req, res) => {
  try {
    await Employee.destroy({ where: {}, truncate: true });
    res.status(200).json({ msg: 'deleted all employees' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal error occured , check console' });
  }
};
