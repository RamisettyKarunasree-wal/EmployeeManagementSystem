const express = require('express');
const router = express.Router();
const Department = require('../models').Department;
const authentication = require('../middlewares/authentication');
router.get('/', authentication, async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
