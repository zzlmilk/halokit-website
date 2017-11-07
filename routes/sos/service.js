var syncRequest = require("sync-request"),
	wx = require("../weixin/wx"),
	conf = require("../../conf/conf"),
	syncReq = require("../util/pub").syncReq,
	querystring = require("querystring"),
	pinyin = require("pinyin"),
	util = require("../util/util"),
	locationData = require("../util/location"),
	checkDevice = require("../util/checkDevice"),
	toRegisterData = {
		status: false,
		msg: '没有用户 ,请注册'
	};

//http://192.168.0.146:9080/halokit-service
module.exports = {
	toLocation: function(req, res) {
		var indexData = req.session.indexData;
		if(!indexData || indexData.length <= 0) {
			var city = locationData.getCity(req);
			var indexData = [];
			var keyList = [];
			for(var i = 0; i < city.length; i++) {
				//判断此索引是否存在
				var pyArr = pinyin(city[i].name, {
					style: pinyin.STYLE_NORMAL
				});
				//纠错
				pinyinRecovery(city[i], pyArr);
				var upStr = pyArr[0][0][0].toUpperCase(); //首字母索引
				//不存在此索引就创建
				if(typeof(keyList[upStr]) == 'undefined') {
					keyList[upStr] = indexData.length;
					indexData.push({
						key: upStr,
						data: [],
					});
					//					console.log(upStr + ' ' + indexData.length);
				}
				var pyIndex = '';
				var pinyinStr = '';
				//拼接首字母 并把原来的首字母设置大写
				for(var j = 0; j < pyArr.length; j++) {
					var ups = pyArr[j][0][0].toUpperCase();
					pyArr[j][0] = ups + pyArr[j][0].substring(1);
					pinyinStr += pyArr[j][0];
					pyIndex += ups;
				}

				indexData[keyList[upStr]].data.push({
					id: city[i].CityID,
					pid: city[i].ProID,
					name: city[i].name,
					pyIndex: pyIndex,
					pyAll: pinyinStr,
				});
			}
			indexData = indexData.sort(keySorter);
			req.session.indexData = indexData;
		}
		//		console.log(indexData);
		res.render('sos/location', {
			indexData: indexData
		});
	},
	toIndex: function(req, res) {
		var query = req.query,
			location = query.location,
			type = query.type ? query.type : req.session.type;
		console.log('类型', type);
		//如果没有用户id参数就是微信登录
		if(!type) {
			var unionid = req.session.unionid;
			if(!unionid) {
				var result = wx.getOpenId(req);
				console.log('微信登录数据', result);
			}

			//如果微信登录失败
			if(unionid) {
				// 查询会员参数
				var _parameter = {
					halokitauthplatforms: [{
						authid: unionid,
						platformtype: 1 //微信
					}]
				};
				//					console.log('会员登录数据', _parameter);
				// 查询会员
				var member = syncReq({
					method: "POST",
					url: "/index/tplogin",
					data: _parameter
				});
				//				console.log('微信会员信息', member);
				if(member.status) {
					req.session.member = member.data.data;
					req.session.memberid = member.data.data.id;
				}

			}

		} else {
			req.session.type = type;
			var　 memberid = query.memberid ? query.memberid : req.session.memberid;
			if(!memberid) {
				res.render('common/error');
				return;
			}
			//app登录
			// 查询会员
			var member = syncReq({
				method: "GET",
				url: "/member/" + memberid
			});
			//			console.log('app会员信息', member.data.data);
			if(!member.status) {
				res.render("common/error", {
					message: '获取用户错误'
				});
				return;
			}
			req.session.member = member.data.data;
			req.session.memberid = member.data.data.id;
		}
		//检测地理位置
		console.log('检测地理位置', location);
		//如果有传入的地区
		if(location) {
			setLocalLocation(req, res);
		}

		res.render('sos/index', {
			memberid: req.session.memberid
		});
	},
	toFind: function(req, res) {
		var location = getLocalLocation(req, res);
		res.render('sos/find', {
			location: location,
			type: req.session.type
		});
	},
	getSosList: function(req, res) {
		var query = req.query,
			pageindex = query.pageindex,
			location = getLocalLocation(req, res);

		if(!pageindex || isNaN(pageindex)) {
			res.json({
				status: false,
				msg: '参数 pageindex 不能为空并且应为数字'
			});
			return;
		}
		if(!location || location == "undefined" || typeof(location) == "undefined") {
			res.json({
				count: 0,
				total: 0,
				pagenum: pageindex,
				list: [],
			});
			return;
		}
		var state = syncReq({
			method: "GET",
			url: "/wechat/sos/?" + 'parameter={"lostplace":"' + location + '"}&pagenum=' + pageindex + '&count=' + conf.pagesize
		});
		//		console.log('获取sos列表', state);
		res.json(state.data.data);
	},
	getMySosList: function(req, res) {
		var memberid = req.session.memberid;

		var state = syncReq({
			method: "GET",
			url: "/wechat/sos/member/" + memberid
		});
		//		console.log(state);
		res.json(state.data);
	},
	getSosDetail: function(req, res) {
		var query = req.query,
			id = query.id,
			memberid = req.session.memberid;

		if(!memberid) {
			res.json(toRegisterData);
			return;
		}
		if(!id || isNaN(id)) {
			res.json({
				status: false,
				msg: '参数 id 不能为空并且应为数字'
			});
			return;
		}
		var state = syncReq({
			method: "GET",
			url: "/wechat/sos/member",
			data: {
				sosid: id,
				memberid: memberid
			}
		});
		//		console.log('sos详情',state.data);
		res.json(state.data);
	},
	toSosDetail: function(req, res) {
		var query = req.query,
			flag_need_guanzhu = false;
		//先判断是否是微信打开
		if(checkDevice.isWechat(req)) {
			//判断是否有scope 参数
			if(!query.scope) {
				res.redirect(req.originalUrl + '&scope=snsapi_userinfo');
				return;
			}

			var result = wx.getOpenId(req),
				unionid = req.session.unionid;
			//如果微信登录失败
			if(!result && !unionid) {
				res.redirect("/register");
				return;
			}
			// 查询会员参数
			var _parameter = {
				halokitauthplatforms: [{
					authid: unionid,
					platformtype: 1, //微信
				}]
			};
			//					console.log('会员登录数据', _parameter);
			// 查询会员
			var member = syncReq({
				method: "POST",
				url: "/index/tplogin",
				data: _parameter
			});

			console.log('会员信息', member);
			if(member.status) {
				req.session.memberid = member.data.data.id;
			}
			flag_need_guanzhu = !member.status;
			console.log('是否需要关注', flag_need_guanzhu);
		}

		var id = query.id,
			memberid = req.session.memberid ? req.session.memberid : query.memberid;
		//判断参数	
		if(!id || isNaN(id)) {
			res.json({
				status: false,
				msg: '参数 id 不能为空并且应为数字'
			});
			return;
		}
		var detail = syncReq({
			method: "GET",
			url: "/wechat/sos/member",
			data: {
				sosid: id,
				memberid: memberid
			}
		});

		//转义HTML
		if(detail.status && detail.data.status == 200) {
			//用户头像
			detail.data.data.imagePath = detail.data.data.imagePath ? JSON.parse(detail.data.data.imagePath).IMG[0] : "http://7xwshy.com1.z0.glb.clouddn.com/7ZBisD2KcPsWDkwT2703.jpeg";
			//宠物头像
			detail.data.data.halokitpet.imagepath = detail.data.data.halokitpet.imagepath ? JSON.parse(detail.data.data.halokitpet.imagepath).IMG[0] : "http://7xwshy.com1.z0.glb.clouddn.com/7ZBisD2KcPsWDkwT2703.jpeg";
			//宠物照片
			for(var i = 0; i < detail.data.data.halokitsosimages.length; i++) {
				detail.data.data.halokitsosimages[i].imageurl = JSON.parse(detail.data.data.halokitsosimages[i].imageurl).IMG[0];
			}
			//发布时间
			detail.data.data.createdate = detail.data.data.createdate.split(' ')[0];
			//丢失时间
			detail.data.data.lostdate = detail.data.data.lostdate.split(' ')[0];
		}
		//		console.log('sos详情', detail.data);
		//		console.log('评论列表', comment.data);
		res.render('sos/detail', {
			detail: detail.data,
			//			comment: comment.data,
			flag_need_guanzhu: flag_need_guanzhu,
		});
	},
	toPublish: function(req, res) {
		var memberid = req.session.memberid,
			member = req.session.member,
			localLocation = getLocalLocation(req, res);
		//获取当前默认时间
		var now = new Date();
		nowDate = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
		//		console.log('获取当前日期', nowDate);
		res.render('sos/publish', {
			nowDate: nowDate,
			localLocation: localLocation
			//			phone: member.mobile
		});
	},
	publish: function(req, res) {
		var query = req.query,
			memberid = req.session.memberid,
			pets = req.session.member.halokitpets,
			location = getLocalLocation(req, res),
			title = query.title,
			//			petNickname = query.petNickname,
			lostTime = query.lostTime,
			lostLocation = query.lostLocation,
			lostAddr = query.lostAddr,
			phone = query.phone,
			wechat = query.wechat,
			qq = query.qq,
			describe = query.describe,
			imagesPath = query.imagesPath;

		//判断是否有宠物
		if(!pets || pets.length <= 0) {
			if(title.replace(/ /g, '') == '') {
				res.json({
					status: false,
					msg: "请输入标题"
				});
				return;
			}
		}
		var petid = pets[0].id;
		//标题
		if(title.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "请输入标题"
			});
			return;
		}
		if(title.length > 30) {
			res.json({
				status: false,
				msg: "标题输入过长"
			});
			return;
		}
		//宠物昵称
		//		if(petNickname.replace(/ /g, '') == '') {
		//			res.json({
		//				status: false,
		//				msg: "请输入宠物昵称"
		//			});
		//			return;
		//		}
		//		if(petNickname.length > 50) {
		//			res.json({
		//				status: false,
		//				msg: "宠物昵称输入过长"
		//			});
		//			return;
		//		}
		//丢失时间
		if(lostTime == '') {
			res.json({
				status: false,
				msg: "请选择丢失时间"
			});
			return;
		}
		//丢失地区
		if(lostLocation == '') {
			res.json({
				status: false,
				msg: "请选择丢失地区"
			});
			return;
		}
		//详细地址
		if(lostAddr.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "请输入详细地址"
			});
			return;
		}
		if(lostAddr.length > 100) {
			res.json({
				status: false,
				msg: "详细地址输入过长"
			});
			return;
		}
		//手机号码
		if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(phone)) {
			res.json({
				status: false,
				msg: "请输入手机号码"
			});
			return;
		}
		//描述
		if(describe.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "请输入描述"
			});
			return;
		}
		if(describe.length > 200) {
			res.json({
				status: false,
				msg: "描述输入过长"
			});
			return;
		}
		//图片
		if(imagesPath.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "至少选择1张图片"
			});
			return;
		}

		var imgDataArr = [];
		var imagesPathArr = imagesPath.split(',');
		for(var i = 0; i < imagesPathArr.length; i++) {
			imgDataArr.push({
				imageurl: '{"IMG":["' + imagesPathArr[i] + '"]}'
			});
		}
		var requestData = {
			memberid: memberid,
			petid: petid,
			city: location,
			title: title,
			//			petname: petNickname,
			lostdate: lostTime + ' 00:00:00',
			lostplace: lostLocation,
			address: lostAddr,
			phone: phone,
			message: describe,
			halokitsosimages: imgDataArr
		}
		if(wechat) {
			requestData.wechat = wechat;
		}
		if(qq) {
			requestData.qq = qq;
		}
		//		console.log(requestData);
		var state = syncReq({
			method: "POST",
			url: "/wechat/sos",
			data: requestData
		});
		//		console.log(state);
		res.json({
			status: state.status && state.data.status == 201
		});
	},
	getLocation: function(req, res) {
		//获取地区
		var province = locationData.getProvince(req),
			city = locationData.getCity(req),
			district = locationData.getDistrict(req),
			pickerData = [];
		var currentProvince, currentCity, currentDistrict;
		//遍历省
		for(var i = 0; i < province.length; i++) {
			currentProvince = {
				value: province[i].ProID,
				text: province[i].name,
				children: []
			};
			//遍历市
			for(var j = 0; j < city.length; j++) {
				if(city[j].ProID != province[i].ProID) {
					continue;
				}
				currentCity = {
					value: city[j].CityID,
					text: city[j].name,
					children: []
				};
				//遍历区
				for(var k = 0; k < district.length; k++) {
					if(district[k].CityID != city[j].CityID) {
						continue;
					}
					currentDistrict = {
						value: 'd' + k,
						text: district[k].name
					};
					currentCity.children.push(currentDistrict);
				}
				currentProvince.children.push(currentCity);
			}
			pickerData.push(currentProvince);
		}

		//console.log(pickerData);
		res.json(pickerData);
	},
	toMyInterest: function(req, res) {
		res.render('sos/myInterest', {
			type: req.session.type
		});
	},
	interest: function(req, res) {
		var query = req.query,
			id = query.id,
			memberid = req.session.memberid;
		console.log('关注id', id);
		console.log('用户id', memberid);
		if(!id || isNaN(id)) {
			res.json({
				status: false,
				msg: '参数 id 不能为空并且应为数字'
			});
			return;
		}
		var state = syncReq({
			method: "POST",
			url: "/wechat/attention",
			data: {
				sosid: id,
				memberid: memberid
			}
		});
		//		console.log('关注返回', state);
		res.json({
			status: state.status && state.data.status == 201
		});
	},
	interestCancel: function(req, res) {
		var query = req.query,
			id = query.id,
			memberid = req.session.memberid;
		console.log('取消关注id', id);
		console.log('用户id', memberid);
		if(!id || isNaN(id)) {
			res.json({
				status: false,
				msg: '参数 id 不能为空并且应为数字'
			});
			return;
		}
		var state = syncReq({
			method: "PUT",
			url: "/wechat/attention/close",
			data: {
				sosid: id,
				memberid: memberid
			}
		});
		//		console.log('取消关注返回', state);
		res.json({
			status: state.status && state.data.status == 205
		});
	},
	getMyInterest: function(req, res) {
		var memberid = req.session.memberid;
		var state = syncReq({
			method: "GET",
			url: "/wechat/sos/attention/" + memberid,
		});
		//		console.log('我的关注', state.data);
		res.json(state.data);
	},
	toPublished: function(req, res) {
		res.render('sos/published', {
			type: req.session.type
		});
	},
	toEdit: function(req, res) {
		var query = req.query,
			id = query.id;

		var state = syncReq({
			method: "GET",
			url: "/wechat/sos/" + id
		});
		if(!state.status) {
			state.data = {
				data: null
			};
			res.render('sos/edit', {
				data: state.data.data
			});
			return;
		}
		var reqData = state.data.data;
		//		console.log('编辑用户数据', reqData);
		//获取丢失时间
		var selectData = new Date(reqData.lostdate);
		selectData = selectData.getFullYear() + "-" + ((selectData.getMonth() + 1) < 10 ? "0" : "") + (selectData.getMonth() + 1) + "-" + (selectData.getDate() < 10 ? "0" : "") + selectData.getDate();
		//处理图片格式
		var imgArr = [];
		for(var i = 0; i < reqData.halokitsosimages.length; i++) {
			imgArr.push(JSON.parse(reqData.halokitsosimages[i].imageurl).IMG[0]);
		}
		reqData.halokitsosimages = imgArr;
		res.render('sos/edit', {
			selectData: selectData,
			data: reqData
		});
	},
	edit: function(req, res) {
		var query = req.query,
			memberid = req.session.memberid,
			location = getLocalLocation(req, res),
			id = query.id,
			title = query.title,
			//			petNickname = query.petNickname,
			lostTime = query.lostTime,
			lostLocation = query.lostLocation,
			lostAddr = query.lostAddr,
			phone = query.phone,
			wechat = query.wechat,
			qq = query.qq,
			describe = query.describe,
			imagesPath = query.imagesPath;

		//标题
		if(title.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "请输入标题"
			});
			return;
		}
		if(title.length > 30) {
			res.json({
				status: false,
				msg: "标题输入过长"
			});
			return;
		}
		//宠物昵称
		//		if(petNickname.replace(/ /g, '') == '') {
		//			res.json({
		//				status: false,
		//				msg: "请输入宠物昵称"
		//			});
		//			return;
		//		}
		//		if(petNickname.length > 50) {
		//			res.json({
		//				status: false,
		//				msg: "宠物昵称输入过长"
		//			});
		//			return;
		//		}
		//丢失时间
		if(lostTime == '') {
			res.json({
				status: false,
				msg: "请选择丢失时间"
			});
			return;
		}
		//丢失地区
		if(lostLocation == '') {
			res.json({
				status: false,
				msg: "请选择丢失地区"
			});
			return;
		}
		//详细地址
		if(lostAddr.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "请输入详细地址"
			});
			return;
		}
		if(lostAddr.length > 100) {
			res.json({
				status: false,
				msg: "详细地址输入过长"
			});
			return;
		}
		//手机号码
		if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(phone)) {
			res.json({
				status: false,
				msg: "请输入手机号码"
			});
			return;
		}
		//描述
		if(describe.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "请输入描述"
			});
			return;
		}
		if(describe.length > 200) {
			res.json({
				status: false,
				msg: "描述输入过长"
			});
			return;
		}
		//图片
		if(imagesPath.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: "至少选择1张图片"
			});
			return;
		}

		var imgDataArr = [];
		var imagesPathArr = imagesPath.split(',');
		for(var i = 0; i < imagesPathArr.length; i++) {
			imgDataArr.push({
				imageurl: '{"IMG":["' + imagesPathArr[i] + '"]}'
			});
		}
		var requestData = {
			memberid: memberid,
			id: id,
			city: location,
			title: title,
			//			petname: petNickname,
			lostdate: lostTime + ' 00:00:00',
			lostplace: lostLocation,
			address: lostAddr,
			phone: phone,
			message: describe,
			halokitsosimages: imgDataArr
		}
		if(wechat) {
			requestData.wechat = wechat;
		}
		if(qq) {
			requestData.qq = qq;
		}
		//		console.log(requestData);
		var state = syncReq({
			method: "PUT",
			url: "/wechat/sos",
			data: requestData
		});
		//		console.log(state);
		res.json({
			status: state.status && state.data.status == 205
		});
	},
	delete: function(req, res) {
		var query = req.query,
			id = query.id;
		//		console.log('删除id', id);
		if(!id || isNaN(id)) {
			res.json({
				status: false,
				msg: '参数 id 不能为空并且应为数字'
			});
			return;
		}
		var state = syncReq({
			method: "PUT",
			url: "/wechat/sos/close/",
			data: {
				id: id
			}
		});
		//		console.log('删除返回', state);
		res.json({
			status: state.status && state.data.status == 205
		});
	},
	getCommentList: function(req, res) {
		var query = req.query,
			id = query.id,
			pageindex = query.pageindex;

		if(!id || isNaN(id)) {
			res.json({
				status: false,
				msg: '参数 id 不能为空并且应为数字'
			});
			return;
		}

		if(!pageindex || isNaN(pageindex)) {
			res.json({
				status: false,
				msg: '参数 pageindex 不能为空并且应为数字'
			});
			return;
		}

		var state = syncReq({
			method: "GET",
			url: "/wechat/soscomment",
			data: {
				sosid: id,
				pagenum: pageindex,
				count: conf.pagesize
			}
		});
		//		console.log('评论列表', state.data);
		res.json(state.data);
	},
	comment: function(req, res) {
		var query = req.query,
			memberid = req.session.memberid,
			id = query.id,
			pid = query.pid,
			msg = query.msg;
		if(!id || isNaN(id)) {
			res.json({
				status: false,
				msg: '参数 id 不能为空并且应为数字'
			});
			return;
		}
		if(pid && isNaN(pid)) {
			res.json({
				status: false,
				msg: '参数 pid 应为数字'
			});
			return;
		}
		if(!msg || msg.replace(/ /g, '') === '' || msg.length > 100) {
			res.json({
				status: false,
				msg: '参数 msg 不能为空并且长度不能大于100'
			});
			return;
		}
		var reqData = {
			sosid: id,
			comment: msg
		};
		if(memberid) {
			reqData.memberid = memberid;
		}
		if(pid) {
			reqData.f_id = pid;
		}
		var state = syncReq({
			method: "POST",
			url: "/wechat/soscomment",
			data: reqData
		});
		//		console.log('评论', state);
		res.json({
			status: state.status && state.data.status == 201
		});
	},
}

//Array.sort 字母数字排序
function keySorter(a, b) {
	if(/^\d/.test(a.key) ^ /^\D/.test(b.key)) return a.key > b.key ? 1 : (a.key == b.key ? 0 : -1);
	return a.key > b.key ? -1 : (a.key == b.key ? 0 : 1);
}
//设置地区
function setLocalLocation(req, res) {
	var locationStr = req.query.location;
	if(locationStr === req.cookies.location) {
		console.log('cookie location 已存在：' + locationStr);
		return;
	}
	console.log('设置cookie location：' + locationStr);
	//同事设置cookie与session 防止因为调用时cookie正好失效 可以从session获取
	res.cookie('location', locationStr, {
		maxAge: locationData.conf.cookieTimeOut //一年
	});
	req.session.location = locationStr;
}
//获取地区 从cookie
//cookie没有的话 就从session拿 并且将cookie赋值
function getLocalLocation(req, res) {
	var location = req.cookies.location;
	//如果cookie没有找到 就从session中保存进cookie
	if(!location) {
		location = req.session.location;
		//如果session里有才保存
		if(location) {
			res.cookie('location', location, {
				maxAge: locationData.conf.cookieTimeOut //一年
			});
		}
	}
	return location;
}

//文字拼音纠错
function pinyinRecovery(city, pinyinArr) {
	if(city.name.indexOf('重庆') >= 0) {
		pinyinArr[0][0] = 'chong';
	}
}