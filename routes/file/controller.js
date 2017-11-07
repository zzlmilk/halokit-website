/**
 * 文件上传
 */

var express = require('express'),
    service = require('./service'),
    app = express();

// 单个图片上传、裁剪接口（参数：rect）
app.post("/base64",  function(req, res, next) {
    service.base64(req, res);
});
module.exports = app;
