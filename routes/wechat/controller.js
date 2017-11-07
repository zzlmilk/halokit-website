var express = require('express'),
    service = require('./service'),
    app = express();
    
app.post("/getsignature", function(req, res, next) {
    service.getsignature(req, res);
});

module.exports = app;