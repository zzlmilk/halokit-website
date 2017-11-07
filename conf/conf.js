/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-01.
 * [网站运行配置]
 */

var _export = {
//	 产线配置
	HOST_SESSION_IP: '127.0.0.1:27017', // session mongodb 数据库配置
	HOST_DB: 'halokit', // mongodb 数据库名
	HOST_IP: 'localhost', // 服务器IP
	HOST_PORT: '81', // 服务器端口号
	POJECT: '', // 项目名
	PORT: '80', // 项目启动端口

	// 本地配置
//	HOST_SESSION_IP: '127.0.0.1:27017', // session mongodb 数据库配置
//	HOST_DB: 'halokit', // mongodb 数据库名
//	HOST_IP: 'api.halokit.cn', // 服务器IP
//	HOST_PORT: '81', // 服务器端口号
//	POJECT: '', // 项目名
//	PORT: '80', // 项目启动端口
	
	// 老王
//	HOST_SESSION_IP: '127.0.0.1:27017', // session mongodb 数据库配置
//	HOST_DB: 'halokit', // mongodb 数据库名
//	HOST_IP: '192.168.0.105', // 服务器IP
//	HOST_PORT: '9080', // 服务器端口号
//	POJECT: '/halokit-service', // 项目名
//	PORT: '80', // 项目启动端口

	appName: 'halokit-web', // 项目名称
	staticSrc: 'public',
	allowUrl: [ // 不用登录拦截的目录
		'/',
		'/faq*',
		'/getCommodityInfo',
		'/cart',
		'/login/*',
		'/h5/*',
		'/pay/*',
		'/register/*',
		'/about/*',
		'/downloads',
		'/sos/*',
		'/file/*',
		'/wechat/*'
	],

	// qq 互联配置
	QQ_APPID: "101348052",
	QQ_APPKEY: "48cd2c2e96ef7326232e3e88ecd70b67",
	
	//公共配置
	pagesize:6,
};

module.exports = _export;