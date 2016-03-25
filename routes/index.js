var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: DEVICE_ID });
  req.app.get('om1').printPins();
    req.app.get('om2').printPins();
});

module.exports = router;
