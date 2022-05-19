const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    res.status(401).json({ error: 'please send the token' });
  }
  try {
    const decodedToken = jwt.verify(token, 'secret_code');
    console.log(decodedToken);
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid token/token expired' });
  }
};
