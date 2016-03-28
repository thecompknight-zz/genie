DEVICE_ID = 'WGENIE-R2D2'
var ORDER_FLUSH_INTERVAL = 3000;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PIUtils = require('./modules/mockpiutils');
var sleep = require('sleep');
var async = require('async');
var OrderingModule = require('./modules/orderingModule');
var OrderManager = require('./modules/orderManager');

var routes = require('./routes/index');
var users = require('./routes/users');

var restClient = require('request');

var app = express();

var statusLed = PIUtils.setupForOutput(4);
//var testButton = PIUtils.setupForInput(17);

PIUtils.sendSignal(statusLed,1);
/*PIUtils.watch(testButton,function(err,value) {
    if (err) {
        throw err;
    }
    console.log("Test Button has value "+value);
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var piShutdown = function() {
    console.log("Shutting down PI");
    statusLed.tearDown();
    //testButton.tearDown();

    app.get('om1').tearDown();
    app.get('om2').tearDown();

    process.exit();
}


// listen for TERM signal .e.g. kill
process.on ('SIGTERM', piShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', piShutdown);


app.set('om1',new OrderingModule(3,5,7,17));
app.set('om2',new OrderingModule(13,15,16,18));

setInterval(OrderManager.flushOrderToServer.bind(OrderManager),ORDER_FLUSH_INTERVAL);

module.exports = app;
