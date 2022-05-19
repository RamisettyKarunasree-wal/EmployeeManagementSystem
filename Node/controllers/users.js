const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const passCorrect = bcrypt.compareSync(password, user.password);
      if (!passCorrect) {
        res.status(401).json({ error: 'Wrong User Credentials' });
      } else {
        const payload = {
          user: { username },
        };
        const token = jwt.sign(payload, 'secret_code', {
          expiresIn: 1200,
        });
        res.status(200).json({ jwt: token, user });
      }
    } else {
      res.status(400).json({ error: "Username doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal error occured, check console' });
  }
};
exports.readUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal error occured, check console' });
  }
};
