/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-13.
 */

var express = require('express'),
    router = express.Router(),
    service = require('./service');

router.get("/", function(req, res, next) {
    service.index(req, res);
});
router.get("/faq", function(req, res, next) {
    service.faq(req, res);
});

module.exports = router;
