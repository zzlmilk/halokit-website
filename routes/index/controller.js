/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-13.
 */

var express = require('express'),
    router = express.Router(),
    service = require('./service');

router.get("/", function(req, res, next) {
    service.init(req, res);
});
router.get("/getCommodityInfo", function(req, res, next){
	service.getCommodityInfo(req, res);
});

module.exports = router;
