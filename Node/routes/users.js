var express = require('express');
var router = express.Router();
const { loginUser, readUsers } = require('../controllers/users');
const authentication = require('../middlewares/authentication');
router.post('/login', loginUser);
router.get('/', authentication, readUsers);
module.exports = router;
