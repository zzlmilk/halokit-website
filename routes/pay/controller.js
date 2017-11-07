var express = require('express'),
    service = require('./wxpay'),
    app = express(),
    payConf = require('../../conf/wxpay'),
    qr = require('qr-image'),
    wxPay = require('weixin-pay')({
        appid: payConf.WX_APPID,
        mch_id: payConf.WX_MCH_ID,
        partner_key: payConf.WX_MCH_KEY,
        pfx: require('fs').readFileSync(payConf.WX_PFX_PATH)
    });

app.get("/", function(req, res, next) {
    service.pay(req, res);
});
app.get("/toAppPay", function(req, res, next) {
    service.toAppPay(req, res);
});
app.get("/qr", function(req, res, next) {
    var img = qr.imageSync(req.query.content);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(img);
});
// 退款
app.get("/refund", function(req, res, next){
    service.refund(req, res);
});
app.post("/return", wxPay.useWXCallback(function(msg, req, res, next){
    service.notify(msg, res);
}));
module.exports = app;
