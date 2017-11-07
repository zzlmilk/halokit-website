/**
 * 工具类
 * getClientIP 获取客户端远程ip
 * getLocalIP 本机内网和外网ip
 * resultJson 用于返回json值，必须用new 创建
 * formatData 用于处理返回的obj对象，其值用于表格内容渲染
 * 
 */

var os = require('os');
module.exports = {
	resultJson: function() {
		this.status = false;
		this.obj = null;
		this.msg = null;
		return this;
	},
	//TODO 获取客户端外网地址 IPv6的地址 需要处理 慎用
	getClientIP: function(req) {
		var ipAddress;
		var forwardIpStr = req.headers['x-forwarded-for'];
		if(forwardIpStr) {
			var forwardIp = forwardIpStr.split(',');
			ipAddress = forwardIp[0];
		}
		if(!ipAddress) {
			ipAddress = req.connection.remoteAdress;
		}
		if(!ipAddress) {
			ipAddress = req.socket.remoteAdress;
		}
		if(!ipAddress) {
			if(req.connection.socket) {
				ipAddress = req.connection.socket.remoteAdress;
			} else if(req.headers['remote_addr']) {
				ipAddress = req.headers['remote_addr'];
			} else if(req.headers['client_ip']) {
				ipAddress = req.headers['client_ip'];
			} else {
				ipAddress = req.ip;
			}

		}
		return ipAddress;
	},
	getLocalIP: function(req) {
		var map = [];
		var ifaces = os.networkInterfaces();
		console.log(ifaces);
		for(var dev in ifaces) {
			if(dev.indexOf('eth0') != -1) {
				var tokens = dev.split(':');
				var dev2 = null;
				if(tokens.length == 2) {
					dev2 = 'eth1:' + tokens[1];
				} else if(tokens.length == 1) {
					dev2 = 'eth1';
				}
				if(null == ifaces[dev2]) {
					continue;
				}
				// 找到eth0和eth1分别的ip
				var ip = null,
					ip2 = null;
				ifaces[dev].forEach(function(details) {
					if(details.family == 'IPv4') {
						ip = details.address;
					}
				});
				ifaces[dev2].forEach(function(details) {
					if(details.family == 'IPv4') {
						ip2 = details.address;
					}
				});
				if(null == ip || null == ip2) {
					continue;
				}
				// 将记录添加到map中去
				if(ip.indexOf('10.') == 0 ||
					ip.indexOf('172.') == 0 ||
					ip.indexOf('192.') == 0) {
					map.push({ "intranet_ip": ip, "internet_ip": ip2 });
				} else {
					map.push({ "intranet_ip": ip2, "internet_ip": ip });
				}
			}
		}
		return map;
	},
	type: function(obj) {
		return Object.prototype.toString.call(obj);
	},
	formatJson: function(obj) {
		var map = {},
			key = "",
			type = this.type;

		function init(obj, key) {
			for(var i in obj) {
				var _key = key;
				if(type(obj[i]) === "[object Object]") {
					if(type(obj) === "[object Array]") {
						_key += "[" + i + "].";
					} else {
						_key += i + ".";
					}
					arguments.callee(obj[i], _key);
				} else if(type(obj[i]) === "[object Array]") {
					if(type(obj) === "[object Array]") {
						_key += "[" + i + "].";
					} else {
						_key += i;
					}
					arguments.callee(obj[i], _key);
				} else {
					_key += i;
					map[_key] = obj[i];
				}
			}
		};
		init(obj, key);
		return map;
	},
	UUID: function(len) {
		// 默认生成二十位的uuid
		var str = "abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWSYZ1234567890",
			uuid = "",
			str_len = str.length;
		if(!len) len = 20;
		// times
		var timekey = "T" + (new Date().getTime() % 3600);
		for(var i = 0; i < (len - timekey.length); i++) {
			uuid += str.split("")[(~~(Math.random() * (str_len - 1)))];
		}
		uuid += timekey;
		return uuid;
	},
	formatMobile: function(mobile) {
		var a = mobile.split(""),
			str = "";
		for(var i = a.length - 1; i >= 0; i--) {
			str = a[i] + str;
			if((i + 1) % 4 == 0) {
				str = '-' + str;
			}
		}

	},
	METHOD_GET: "GET",
	METHOD_POST: "POST",
	METHOD_PUT: "PUT",
	METHOD_DELETE: "DELETE",
}

/* 原型链扩展 */
/**
 * 格式化时间，该方法copy自网络
 * @param {Object} fmt
 */
Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}