var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/uploads/:image', (req, res) => {
  const imagePath = path.join(__dirname, '../', `/uploads/${req.params.image}`);
  res.sendFile(imagePath);
});

module.exports = router;
