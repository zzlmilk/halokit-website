var express = require('express'),
	service = require('./service'),
	app = express();

// h5展示页面
app.get("/", function(req, res, next) {
	service.toIndex(req, res);
});
app.get("/location", function(req, res, next) {
	service.toLocation(req, res);
});
app.get("/getlocation", function(req, res, next) {
	service.getLocation(req, res);
});
app.get("/find", function(req, res, next) {
	service.toFind(req, res);
});
app.get("/getList", function(req, res, next) {
	service.getSosList(req, res);
});
app.get("/detail", function(req, res, next) {
	service.toSosDetail(req, res);
});
app.get("/getDetail", function(req, res, next) {
	service.getSosDetail(req, res);
});
app.get("/getMyList", function(req, res, next) {
	service.getMySosList(req, res);
});
app.get("/publish", function(req, res, next) {
	service.toPublish(req, res);
});
app.get("/publish.do", function(req, res, next) {
	service.publish(req, res);
});
app.get("/myInterest", function(req, res, next) {
	service.toMyInterest(req, res);
});
app.get("/getMyInterest", function(req, res, next) {
	service.getMyInterest(req, res);
});
app.get("/interest.do", function(req, res, next) {
	service.interest(req, res);
});
app.get("/interest.cancel", function(req, res, next) {
	service.interestCancel(req, res);
});
app.get("/published", function(req, res, next) {
	service.toPublished(req, res);
});
app.get("/edit", function(req, res, next) {
	service.toEdit(req, res);
});
app.get("/edit.do", function(req, res, next) {
	service.edit(req, res);
});
app.get("/delete.do", function(req, res, next) {
	service.delete(req, res);
});
app.get("/getCommentList", function(req, res, next) {
	service.getCommentList(req, res);
});
app.get("/comment.do", function(req, res, next) {
	service.comment(req, res);
});
module.exports = app;