var signature = require('wx_jsapi_sign'),
	wxpay = require('../../conf/wxpay');
module.exports = {
	getsignature: function(req, res) {
		var url = req.body.url;
		console.log('请求地址:', url);
		signature.getSignature({
			appId: wxpay.WX_APPID,
			appSecret: wxpay.WX_APPSECRET,
			appToken: wxpay.WX_APPTOKEN,
			cache_json_file: wxpay.cache_json_file
		})(url, function(error, result) {
			var rtnData;
			if(error) {
				rtnData = {
					'error': error
				};
			} else {
				rtnData = wxpay.WX_JSSDK_CONFIG;
				rtnData.appId = result.appId;
				rtnData.timestamp = result.timestamp;
				rtnData.nonceStr = result.nonceStr;
				rtnData.signature = result.signature;
			}
//			console.log('返回数据', rtnData);
			res.json(rtnData);
		});
	},

}