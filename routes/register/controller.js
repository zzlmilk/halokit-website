/**
 * Created by sheryl(tiantianl417@163.com) in 2016-07-18.
 */

var express = require('express'),
    register = express(),
    service = require('./service');

//进入注册界面
register.get("/", function(req, res, next) {
    service.init(req, res);
});

//点击注册
register.post("/register", function(req, res, next) {
    service.register(req, res);
});

module.exports = register;
