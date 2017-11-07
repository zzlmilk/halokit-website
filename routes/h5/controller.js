var express = require('express'),
    service = require('./service'),
    app = express();
// 手机端
app.get("/personal", function(req, res, next) {
    service.personal(req, res);
});
// h5展示页面
app.get("/", function(req, res, next) {
    service.show(req, res);
});
// h5了解可点
app.get("/about/contact", function(req, res, next) {
    service.contact(req, res);
});
// h5联系我们
app.get("/about/know", function(req, res, next) {
    service.know(req, res);
});
//广告
app.get("/adv", function(req, res, next) {
    service.adv(req, res);
});

//商城
// 购物车
app.get("/cart", function(req, res, next) {
    service.toCart(req, res);
});
// 订单确认页面
app.get("/toPay", function(req, res, next) {
    service.toPay(req, res);
});
app.get("/refund/:orderid", function(req, res, next) {
    service.refund(req, res);
});
app.get("/send/:id", function(req, res, next) {
    service.send(req, res);
});

app.get("/authcode/:mobile", function(req, res, next){
    service.authcode(req, res);
});

// 商品页面
app.get("/:id", function(req, res, next) {
    service.h5(req, res);
});
// 支付
app.post("/pay", function(req, res){
    service.pay(req, res);
});
// 未完成支付支付
app.post("/payByOrderSn", function(req, res){
    service.payByOrderSn(req, res);
});
// 删除购物车
app.post("/cart", function(req, res, next) {
    service.cart(req, res);
});
// 注册请求
app.post("/register", function(req, res, next){
    service.register(req, res);
});

//TODO 2016-11-22 新增 商户入驻模块 王景麒
//app任务
app.get("/mission/signin", function(req, res, next) {
    service.missionSignin(req, res);
});
//申请入驻
app.get("/settled/apply", function(req, res, next) {
    service.toSettledApply(req, res);
});
app.get("/settled/apply.do", function(req, res, next) {
    service.settledApply(req, res);
});
//完善信息
app.get("/settled/improveInfo", function(req, res, next) {
    service.toSettledImproveInfo(req, res);
});
app.get("/settled/improveInfo.do", function(req, res, next) {
    service.settledImproveInfo(req, res);
});
//商户平台框架
app.get("/settled/platform", function(req, res, next) {
    service.toSettledPlatform(req, res);
});
//旧版平台
app.get("/settled/platformShow", function(req, res, next) {
    service.toSettledPlatformShow(req, res);
});
//签到列表
app.get("/settled/platformShowSignin", function(req, res, next) {
    service.toSettledPlatformSignin(req, res);
});
//获取今天签到列表
app.get("/settled/getTodaySigninList", function(req, res, next) {
    service.getTodaySigninList(req, res);
});
//单条确定签到
app.get("/settled/signinConfirm", function(req, res, next) {
    service.signinConfirm(req, res);
});
//单条确定签到
app.get("/settled/allSigninConfirm", function(req, res, next) {
    service.allSigninConfirm(req, res);
});
//营业统计
app.get("/settled/platformShowStatistics", function(req, res, next) {
    service.toSettledPlatformStatistics(req, res);
});
//获取营业统计
app.get("/settled/getSatistics", function(req, res, next) {
    service.getSatistics(req, res);
});
//获取营业统计明细
app.get("/settled/getSatisticsDetail", function(req, res, next) {
    service.getSatisticsDetail(req, res);
});
//用户信息
app.get("/settled/platformShowUserinfo", function(req, res, next) {
    service.toSettledPlatformUserinfo(req, res);
});
//核销
app.post("/approvedSales/login.do", function(req, res, next) {
    service.approvedSalesLogin(req, res);
});
app.get("/approvedSales/do/:cn", function(req, res, next) {
    service.toApprovedSales(req, res);
});
module.exports = app;
