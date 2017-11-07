var express = require('express'),
    router = express.Router(),
    service = require('./service');

router.get("/contact", function(req, res, next) {
    service.contact(req, res);
});

router.get("/know", function(req, res, next) {
    service.know(req, res);
});

router.get("/join", function(req, res, next) {
    service.join(req, res);
});


module.exports = router;