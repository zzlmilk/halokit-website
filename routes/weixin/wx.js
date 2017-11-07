var util = require('../util/util'),
    conf = require("../../conf/wxpay"),
    syncRequest = require('sync-request');

/**
* 微信接口
* 请勿重复调用该接口下的方法，先判断session中是否有，再调用
* 关键字： openid / access_token / jsapi_ticket
*/
module.exports = {
	getOpenId: function(req){
		// 获取微信重定向的code
		var _code = req.query.code,
			_url = [
				"https://api.weixin.qq.com/sns/oauth2/access_token",
				"?appid=",
				conf.WX_APPID,
				"&secret=",
				conf.WX_APPSECRET,
				"&code=", 
				_code,
				"&grant_type=authorization_code"
			];
		if(_code){
			_url = _url.join("");
			var result = syncRequest(util.METHOD_GET, _url, null);
			result = JSON.parse(result.getBody('utf-8'));
			if(result.openid){
				req.session.openid = result.openid;
				req.session.access_token = result.access_token;
				req.session.unionid = result.unionid;
			}
			return result;
		}else{
			return null;
		}
	},
	getOpenIdForWOP: function(req){ // wechat open Platform , 微信开放平台
		// 获取微信重定向的code
		var _code = req.query.code,
			_url = [
				"https://api.weixin.qq.com/sns/oauth2/access_token",
				"?appid=",
				conf.WX_WOP_APPID,
				"&secret=",
				conf.WX_WOP_APPSECRET,
				"&code=", 
				_code,
				"&grant_type=authorization_code"
			];
		if(_code){
			_url = _url.join("");
			var result = syncRequest(util.METHOD_GET, _url, null);
			result = JSON.parse(result.getBody('utf-8'));

			if(result.openid){
				req.session.openid = result.openid;
				req.session.access_token = result.access_token;
				req.session.unionid = result.unionid;
			}
			return result.openid?result: null;
		}else{
			return null;
		}
	},
	getUserInfo: function(req){
		// 拿到openid 和 access_token
		var openid = req.session.openid,
			access_token = req.session.access_token,
			_url = [
				"https://api.weixin.qq.com/sns/userinfo",
				"?access_token=",
				access_token,
				"&openid=",
				openid,
				"&lang=zh_CN" 
			];
		if(openid){
			_url = _url.join("");
			var result = syncRequest(util.METHOD_GET, _url, null);
			result = JSON.parse(result.getBody('utf-8'));
			return result;
		}else{
			return null;
		}
	},
	getJsapiTicket: function(req){
		var access_token = req.session.access_token,
			_url = [
				"https://api.weixin.qq.com/cgi-bin/ticket/getticket",
				"?access_token=",
				access_token,
				"&type=jsapi"
			];
		if(access_token){
			_url = _url.join("");
			var result = syncRequest(util.METHOD_GET, _url, null);
			result = JSON.parse(result.getBody('utf-8'));
			// 如果成功存ticket
			if(result.ticket){
				req.session.jsapi_ticket = result.ticket;
			}
			return result;
		}else{
			return null;
		}
	}
}