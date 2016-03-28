var express = require('express');
var config = require('../modules/config');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: config.DEVICE_ID });
  req.app.get('om1').printPins();
    req.app.get('om2').printPins();
});

module.exports = router;
