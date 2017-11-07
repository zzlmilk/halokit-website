/**
 * Created by sheryl(tiantianl417@163.com) in 2016-07-18.
 */

var express = require('express'),
    login = express(),
    service = require('./service'),
    qq = require('./qq'),
    wechat = require('./wechat');

//进入登录界面
login.get("/", function(req, res, next) {
    service.init(req, res);
});

//点击登录
login.post("/login", function(req, res) {
    service.login(req, res);
});

//点击退出登录
login.get("/logout", function(req, res) {
    service.logout(req, res);
});


/* ------------------- QQ 登陆 ------------------- */
login.get("/qq", function(req, res, next){
	qq.login(req, res);
});
login.get("/redirect", function(req, res, next){
    qq.redirect(req, res);
});
/* ------------------ QQ 登陆 end ------------------ */



/* ------------------- wechat 登陆 ------------------- */
login.get("/toWechat", function(req, res, next){
	wechat.toLogin(req, res);
});
login.get("/wechat", function(req, res, next){
	wechat.login(req, res);
});

/* ------------------ wechat 登陆 end ------------------ */


module.exports = login;
