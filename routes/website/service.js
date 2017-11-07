/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-13.
 */
var syncReq = require("../util/pub").syncReq;

module.exports = {
	index: function(req, res) {
		res.render("website/index", {
			nowYear: new Date().getFullYear()
		});
	},
	faq: function(req, res) {
		res.render("website/faq", {
			nowYear: new Date().getFullYear()
		});
	},
}