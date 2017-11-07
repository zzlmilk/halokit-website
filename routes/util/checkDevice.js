/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-18.
 * [公共函数]
 */

var _export = {
	isWechat: function(req) {
		return req.headers["user-agent"].toLowerCase().match(/MicroMessenger/i) == "micromessenger"
	}

};

module.exports = _export;