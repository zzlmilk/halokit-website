/**
 * 微信支付和登录相关配置
 */

module.exports = {
	// 产线配置
	WX_REDIRECT_URL: 'http://www.halokit.cn/weixin/loginCallback',
	WX_NOTIFY_URL: 'http://www.halokit.cn/pay/return',
	PAY_NOTIFY_URL: 'http://www.halokit.cn/pay/return',
	WX_PFX_PATH: '/usr/local/nodeprj/cert/apiclient_cert.p12', // 证书物理路径，必须
//	WX_PFX_PATH: '/halokit_nodeprj/apiclient_cert.p12', //windows 下测试
	WX_WOP_LOGIN_URI: "http://halokit.cn/login/wechat",

	// 开发配置
	//WX_REDIRECT_URL: 'http://www.halokit.cn/weixin/loginCallback',
	//WX_NOTIFY_URL: 'http://634c7595.ngrok.natapp.cn/pay/return',
	//PAY_NOTIFY_URL: 'http://634c7595.ngrok.natapp.cn/pay/return',
	//WX_PFX_PATH: '/Users/ray/Prj/HaloKit/_res/wxpay-cert/apiclient_cert.p12', // 证书物理路径，必须
	//WX_WOP_LOGIN_URI: "http://634c7595.ngrok.natapp.cn/login/wechat",

	//测试公众号配置
//	WX_APPID: 'wx79658a3336143253',
//	WX_APPSECRET: '60948e4efb4b4033322eaf661f594c42',

	// 基本配置
	WX_APPID: 'wx9226cb03b7e37f95',
	WX_APPSECRET: '2bbcb3e13a9551b74b62ef99f89e9ef3',

	//微信缓存目录
	cache_json_file: process.cwd() + '/tmp',
	
	//微信jssdk配置
	WX_JSSDK_CONFIG: {
		debug: false,
		jsApiList: [
			'checkJsApi',
			'onMenuShareAppMessage',
			'onMenuShareTimeline',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'onMenuShareQZone',
			'startRecord',
			'stopRecord',
			'onVoiceRecordEnd',
			'playVoice',
			'pauseVoice',
			'stopVoice',
			'onVoicePlayEnd',
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			'translateVoice',
			'getNetworkType',
			'openLocation',
			'getLocation',
			'hideOptionMenu',
			'showOptionMenu',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'closeWindow',
			'scanQRCode',
			'chooseWXPay',
			'openProductSpecificView',
			'addCard',
			'chooseCard',
			'openCard'
		]
	},

	// 开放平台
	WX_WOP_APPID: 'wx18e8a277c71377d9',
	WX_WOP_APPSECRET: '09500a7e09b4ed382f2dc145ab1a3ccf',
	WX_WOP_SCOPE: "snsapi_login",

	// 微信授权配置
	WX_RESPONSE_TYPE: 'code',
	WX_SCOPE: 'snsapi_base',
	WX_STATE: 'debb3b7354c82a8c55553ec47970d9d1',

	// 支付相关配置
	WX_MCH_ID: '1332669001', // 商户号
	WX_MCH_KEY: 'NKVlDHinKcpdr0mLQTr3laOA4sHL8AlO', // 商户api密钥
	//开放平台
	WX_WOP_MCH_ID: '1418183302',
	WX_WOP_MCH_KEY: 'B12529FEddeD48818fEBe2e9293D96F1',
}