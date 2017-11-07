var express = require('express'),
    service = require('./service'),
    app = express();
    
app.get("/", function(req, res, next) {
    service.show(req, res);
});

module.exports = app;