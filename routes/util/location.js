/**
 * Created by keki(383418346@qq.com) in 2016-12-16.
 * [公共函数]
 */
var syncRequest = require('sync-request'),
	syncReq = require("../util/pub").syncReq,
	fs = require('fs'),
	_export = {
		conf:{
			cookieTimeOut:315360000000,//地区cookie失效时间:十年
		},
		getProvince: function(req) {
			if(req.session.province){
				return req.session.province;
			}
			//获取csv
			var url = null,
				data = null;
			try {
				url = process.cwd() + '/public/json/province.json';
				var str = fs.readFileSync(url);
				data = new Buffer(str, 'utf-8').toString();
			} catch(e) {
				console.log('文件路径：' + url + '异常：' + e);
				return;
			}
			data = JSON.parse(data);
			req.session.province = data;
			return data;
		},
		getCity: function(req) {
			if(req.session.city){
				return req.session.city;
			}
			//获取csv
			var url = null,
				data = null;
			try {
				url = process.cwd() + '/public/json/city.json';
				var str = fs.readFileSync(url);
				data = new Buffer(str, 'utf-8').toString();
			} catch(e) {
				console.log('文件路径：' + url + '异常：' + e);
				return;
			}
			data = JSON.parse(data);
			req.session.city = data;
			return data;
		},
		getDistrict: function(req) {
			if(req.session.district){
				return req.session.district;
			}
			//获取csv
			var url = null,
				data = null;
			try {
				url = process.cwd() + '/public/json/area.json';
				var str = fs.readFileSync(url);
				data = new Buffer(str, 'utf-8').toString();
			} catch(e) {
				console.log('文件路径：' + url + '异常：' + e);
				return;
			}
			data = JSON.parse(data);
			req.session.district = data;
			return data;
		},
		//获取ip信息 淘宝接口
		getIpInfoByTaoBaoApi : function(ip){
			var rtnData = {
				status : false,
				msg:'ip 字符串异常 可能为空'
			};
			if(!ip || ip.replace(/ /g,'')=='' || typeof(ip) == undefined){
				return rtnData;
			}
			
			var rtnData = syncReq({
					method: "GET",
					url: "http://ip.taobao.com/service/getIpInfo.php?ip="+ip
				});
			return rtnData;
		},
	};

module.exports = _export;