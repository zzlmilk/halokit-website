var util = require("../util/util"),
	conf = require("../../conf/conf"),
	syncRequest = require("sync-request"),
	wx = require("../weixin/wx"),
	syncReq = require("../util/pub").syncReq,
	querystring = require("querystring");

// 缓存，getCommodities方法调用缓存内容
var COMMODITES = [];

module.exports = {
	index: function(req, res) {

	},
	h5: function(req, res) {
		var query = req.query,
			_id = req.params.id,
			newData = {};
		// 请求
		var result = syncReq({
			method: util.METHOD_GET,
			url: "/web/commodity/" + _id,
		});
		if(result.status) {
			var _COMMODITY = result.data.data.commodities,
				_commodity_id = result.data.data.commodityid,
				_commodity_name = result.data.data.name;
			
			//TODO 2010113 暂时去除马鞍棕与桃子粉的L号数据 王景麒
			for (var i = 0; i < _COMMODITY.length; i++) {
				if((_COMMODITY[i].color.name == 'BLACK' || _COMMODITY[i].color.name == 'PINK')&& _COMMODITY[i].size.name =='L')
				{
					_COMMODITY.splice(i,1);
					i--;
				}
			}
//			console.log(_COMMODITY);
			// 对结构数据进行重组，以便前端渲染
			_COMMODITY.forEach(function(e) {
				e.name = _commodity_name;
				newData.commodityid = _commodity_id;
				newData.name = _commodity_name;
				if(!newData.size) newData.size = {};
				if(!newData.size[e.size.id]) newData.size[e.size.id] = e.size;
				if(!newData.size[e.size.id].color) newData.size[e.size.id].color = {};
				if(!newData.size[e.size.id].color[e.sku]) {
					e.color.id = e.sku;
					newData.size[e.size.id].color[e.color.id] = e.color;
				}
				// newData.size[e.size.id].color[e.color.id].num = e.num;
				newData.size[e.size.id].color[e.color.id].price = e.price;
				newData.size[e.size.id].color[e.color.id].imagepath = e.imagepath;
				newData.size[e.size.id].color[e.color.id].ismarketable = e.ismarketable;
			});

		}
		
		//		res.json({
		//			data: newData,
		//			memberid:query.memberid,
		//			shopcode:query.shopcode,
		//			type:query.type,
		//		});
		res.render("h5/index", {
			data: newData,
			memberid: query.memberid,
			shopcode: query.shopcode,
			type: query.type,
		});
	},
	personal: function(req, res) {
		var status = req.query.status,
			id = req.session.memberid,
			member = null;

		if(!id) {
			wx.getOpenId(req);
			var result = wx.getUserInfo(req);
			if(!result) {
				res.render("h5/notify", {
					msg: "微信登陆失败",
					status: false
				});
				return;
			}
			var member = syncReq({
				method: "POST",
				url: "/index/tplogin",
				data: {
					halokitauthplatforms: [{
						authid: result.unionid,
						platformtype: 1
					}]
				}
			});
			if(member.status) {
				id = req.session.memberid = member.data.data.id;
			} else {
				// 注册页面
				res.render("h5/register");
				return;
			}

		}
		var _result = syncReq({
			method: "GET",
			url: "/web/order/" + id + "?ispage=false&status=" + status
		});

		if(!req.session.openid) {
			wx.getOpenId(req);
		}
		var wxMember = wx.getUserInfo(req);

		console.log("---------会员信息----------");
		console.log(wxMember);

		res.render("h5/personal", {
			data: _result.status ? _result.data.data : null,
			member: wxMember,
			status: status
		});
	},
	show: function(req, res) {
		var query = req.query;
		res.render("h5/show", {
			memberid: query.memberid,
			shopcode: query.shopcode,
			type: query.type,
		});
	},
	contact: function(req, res) {
		res.render("h5/contact");
	},
	know: function(req, res) {
		res.render("h5/know");
	},
	cart: function(req, res) {
		var carts = req.body.carts,
			rj = new util.resultJson(),
			commodities = req.session.commodities;
		rj.status = true;
		for(var i in carts) {
			if(commodities[carts[i].id]) {
				delete commodities[carts[i].id];
			} else {
				rj.status = false;
				rj.msg = "您要买的宝贝不见了，请清空缓存并且重新加入购物车";
			}
		}
		res.json(rj);
	},
	toCart: function(req, res) {
		var query = req.query,
			id = query.id,
			sku = query.sku,
			//			commodities = req.session.commodities,
			//			commodity = {},
			//			commodities = commodities ? commodities : {};
			commodities = {},
			commodity = {};
		if(id || sku) {
			commodity = getCommodities(id, sku);
			//			if(commodity) {
			//				if(commodities[sku]) {
			//					//TODO 停止每一次都会加一件的bug 王景麒 2016-12-15
			//					//					commodities[sku].count += 1;
			//				} else {
			// 初始化
			commodity.count = 1;
			commodities[commodity.sku] = commodity;
			//				}
			//			} else {
			delete req.session.commodities;
			//			}
		}

		req.session.commodities = isEmpty(commodities) ? null : commodities;
		var rtnData = {
			data: req.session.commodities
		};
		if(query.type) {
			rtnData.memberid = query.memberid;
			rtnData.shopcode = query.shopcode;
			rtnData.type = query.type;
		} else if(!query.type && query.shopcode) {
			rtnData.shopcode = query.shopcode;
		}
		//		res.json(rtnData);
		res.render("h5/cart", rtnData);
	},
	pay: function(req, res) {
		var _commodity = req.body;
		_commodity.memberid = req.session.memberid;
		var spbill_create_ip = _commodity.spbill_create_ip;
		delete _commodity.spbill_create_ip;
		console.log('发送的订单数据---->>', _commodity);
		var type = _commodity.type;
		delete _commodity.type;
		var _result = syncReq({
			//			url: "/web/order",
			url: "/web/order",
			method: "POST",
			data: _commodity,
		});

		console.log("订单生成返回结果---->>", _result);

		if(_result.status) {
			// 下单成功
			var _data = {
				out_trade_no: _result.data.data.ordersn,
				total_fee: _commodity.payment * 100, // 微信创业支付以分为单位
				spbill_create_ip: spbill_create_ip,
				openid: req.session.openid,
				body: "可点智能宠物项圈"
			};

			console.log(_data);
			if(type) {
				res.redirect("/pay/toAppPay?" + querystring.stringify(_data));
			} else {
				res.redirect("/pay?" + querystring.stringify(_data));
			}

		} else {
			// 订单失败
			res.json({
				status: false
			});
		}

	},
	payByOrderSn: function(req, res) {
		var orderSn = req.body.orderSn,
			spbill_create_ip = req.body.spbill_create_ip;
		var _data = {
			ordersn: orderSn,
			statusname: "CUSTCONFIRM"
		}

		var _result = syncReq({
			url: "/order?parameter=" + JSON.stringify(_data),
			method: "GET"
		});

		if(_result.status) {
			var obj = _result.data.data.list[0];
			// 订单查询成功
			var _data = {
				out_trade_no: obj.ordersn,
				total_fee: obj.paymentamount * 100, // 微信创业支付以分为单位
				spbill_create_ip: spbill_create_ip,
				openid: req.session.openid,
				body: "可点智能宠物项圈"
			};
			console.log(_data);
			res.redirect("/pay?" + querystring.stringify(_data));
		} else {
			res.json({
				status: false
			});
		}

	},
	toPay: function(req, res) {
		var query = req.query,
			data = JSON.parse(query.carts),
			result = wx.getOpenId(req),
			unionid = req.session.unionid;
		var count = 0;
		for(var i in data.carts) {
			count += ~~data.carts[i].count;
		}
		data.count = count;
		// 检测微信
		if(result) {
			//是微信
			// 微信用户信息
			var userinfo = wx.getUserInfo(req);

			// 查询会员参数
			var _parameter = {
				halokitauthplatforms: [{
					authid: unionid,
					platformtype: 1
				}]
			}
			console.log('会员登录数据', _parameter);
			// 查询会员
			var member = syncReq({
				method: "POST",
				url: "/index/tplogin",
				data: _parameter
			});
			console.log('会员信息', member);
			if(!member.status) {
				// 进入注册页面
				res.render("h5/register", {
					unionid: unionid,
				});
				return;
			}
			req.session.memberid = member.data.data.id;
		} else {
			//不是微信 检测是否是app
			if(!data.type) {
				//不是
				res.render("h5/notify", {
					msg: "微信登陆失败",
					status: false
				});
				return;
			}

			req.session.memberid = data.memberid;
		}
		data.memberid = req.session.memberid;
		//		console.log(data);
		res.render("h5/pay", data);

	},
	refund: function(req, res) {
		var orderid = req.params.orderid;
		// http://api.halokit.cn/web/refund
		console.log("退款订单id:", orderid);
		var _result = syncReq({
			url: "/web/refund",
			method: "POST",
			data: {
				orderid: orderid
			}
		});
		if(_result.status) {
			var _obj = _result.data.data;
			var _params = {
				refundsn: _obj.refundsn,
				paydamount: _obj.refundamount * 100, //原支付金额
				refundamount: _obj.refundamount * 100, //退款金额
				transactionid: _obj.transactionid
			}

			res.redirect("/pay/refund?" + querystring.stringify(_params));
		} else {
			res.json({
				status: false,
				msg: "未查询此订单，请刷新重试"
			});
		}
	},
	send: function(req, res) {
		var id = req.params.id,
			status = req.query.status,
			rj = new util.resultJson();
		var _params = {
			method: util.METHOD_PUT,
			url: "/web/order/status/" + id + "?status=" + status
		}
		rj = syncReq(_params);
		res.json(rj);
	},
	register: function(req, res) {
		var params = req.body,
			rj = new util.resultJson();

		var userinfo = wx.getUserInfo(req);

		// 三方登录
		var member = syncReq({
			method: "POST",
			url: "/index/tplogin",
			data: {
				mobile: params.mobile,
				authcode: params.authcode,
				halokitauthplatforms: [{
					authid: userinfo.unionid,
					platformtype: 1 // 微信平台编号
				}],
				halokitmemberext: [{
					nickname: userinfo.nickname,
					imagepath: JSON.stringify({
						"IMG": [userinfo.headimgurl]
					}),
					sex: userinfo.sex,
					city: userinfo.city,

				}]
			}
		});

		if(member.status) {
			rj.status = true;
		} else {
			rj = member;
		}

		res.json(rj);
	},
	authcode: function(req, res) {
		var authCode = syncReq({
			method: "GET",
			url: "/authcode/" + req.params.mobile
		});
		res.json(authCode);
	},

	//TODO 2016-11-22 新增 商户模块 王景麒
	toSettledApply: function(req, res) {
		var result = wx.getOpenId(req),
			openid = result.openid;
		console.log(result.openid);
		//查询店铺申请进度
		var applyState = syncReq({
			method: "GET",
			url: "/wechat/register/" + openid,
		});
		console.log('Apply店主申请状态', applyState);
		if(applyState.data && applyState.data.status == 200) {
			res.redirect('improveInfo');
			return;
		}
		res.render("h5/settled/apply");
	},
	settledApply: function(req, res) {
		var query = req.query,
			phoneNumber = query.phone,
			openid = req.session.openid;

		//判断手机号码
		if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(phoneNumber)) {
			res.json({
				status: false,
				msg: '手机号码不正确'
			});
			return;
		}

		//判断openid
		if(!openid || openid.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: '用户标识获取失败'
			});
			return;
		}
		//绑定店主
		var state = syncReq({
			method: "POST",
			url: "/wechat/register/",
			data: {
				mobile: phoneNumber,
				authId: openid,
			}
		});
		console.log('绑定店主状态', state);
		res.json(state);
	},
	toSettledImproveInfo: function(req, res) {
		var openid = req.session.openid;
		var state = syncReq({
			method: "GET",
			url: "/wechat/shop/request/" + openid
		});
		console.log('ImproveInfo店铺申请状态', state.data);
		if(state.data.data.length != 0) {
			if(state.data.data[0].isaccept === 0) {
				//等待审核
				res.render("h5/settled/auditing", {
					createDate: state.data.data[0].createDate
				});
				return;
			} else if(state.data.data[0].isaccept === 1) {
				//已通过审核
				res.redirect('platform');
				return;
			} else {
				//失败
				return;
			}
		}
		res.render("h5/settled/improveInfo");
	},
	settledImproveInfo: function(req, res) {
		var query = req.query,
			shopname = query.shopname,
			linkqq = query.linkqq,
			linkman = query.linkman,
			openid = req.session.openid;
		//判断QQ号码
		if(!/^[1-9][0-9]{4,9}$/.test(linkqq)) {
			res.json({
				status: false,
				msg: '手机号码不正确'
			});
			return;
		}

		//判断联系人名称不为空
		if(linkman.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: '联系人名称不能为空'
			});
			return;
		}

		//判断店铺名称不为空
		if(shopname.replace(/ /g, '') == '') {
			res.json({
				status: false,
				msg: '店铺名称不能为空'
			});
			return;
		}

		var state = syncReq({
			method: "POST",
			//			url: "/wechat/shop/request",
			url: "/wechat/shop/request",
			data: {
				openid: openid,
				name: shopname,
				phone: linkqq,
				linkman: linkman,
			}
		});
		console.log('店铺申请状态', state);
		res.json(state);
	},
	toSettledPlatform: function(req, res) {
		res.render("h5/settled/platform/index");
	},
	toSettledPlatformShow: function(req, res) {
		var query = req.query,
			openid = req.session.openid;

		var state = syncReq({
			method: "GET",
			url: "/member/walk/sign/" + openid
		});
		console.log('当天有效签到列表', state.data);
		res.render("h5/settled/platform/show", {
			signinList: state.data
		});
	},
	toSettledPlatformSignin: function(req, res) {
		var query = req.query,
			openid = req.session.openid;

		var state = syncReq({
			method: "GET",
			url: "/member/walk/sign/" + openid
		});
		console.log('当天有效签到列表', state.data);
		res.render("h5/settled/platform/signin", {
			signinList: state.data
		});
	},
	getTodaySigninList: function(req, res) {
		var query = req.query,
			openid = req.session.openid;

		var state = syncReq({
			method: "GET",
			url: "/member/walk/sign/" + openid
		});
		console.log('当天有效签到列表', state.data);
		res.json(state.data);
	},
	signinConfirm: function(req, res) {
		var query = req.query;
		var signinId = query.id;
		if(!signinId) {
			res.json({
				status: false,
				msg: '参数 id 是必须的'
			});
			return;
		}
		var state = syncReq({
			method: "PUT",
			url: "/wechat/shop/request/updatesign/" + signinId
		});
		if(!state.status) {
			res.json({
				status: false,
				msg: '操作失败,未知错误'
			});
			return;
		}
		console.log('单个签到确认', state);
		res.json(state.data);
	},
	allSigninConfirm: function(req, res) {
		var query = req.query;
		var signinId = query.id;
		if(!signinId) {
			res.json({
				status: false,
				msg: '参数 id 是必须的'
			});
			return;
		}
		var state = syncReq({
			method: "PUT",
			url: "/wechat/shop/request/updatesign/all",
			data: signinId
		});
		if(!state.status) {
			res.json({
				status: false,
				msg: '操作失败,未知错误'
			});
			return;
		}
		console.log('一键签到确认', state);
		res.json(state.data);
	},
	toSettledPlatformStatistics: function(req, res) {
		var query = req.query,
			openid = req.session.openid;
		var now = new Date();
		var nowYearMonth = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1);
		console.log('营业统计获取当前年月', nowYearMonth);
		var startDate = nowYearMonth + '-01 00:00:00';
		var endDate = nowYearMonth + '-31 23:59:59';
		var state = syncReq({
			method: "GET",
			url: '/order/shop/month/report?parameter={"openid":"' + openid + '","startDate":"' + startDate + '","endDate":"' + endDate + '"}'
		});
		console.log('营业统计列表' + startDate + '~' + endDate, state.data);

		res.render("h5/settled/platform/statistics", {
			nowYearMonth: nowYearMonth,
			dataList: state.data
		});
	},
	getSatistics: function(req, res) {
		var query = req.query,
			openid = req.session.openid,
			startDate = query.startDate,
			endDate = query.endDate;
		var startDate = startDate + '-01 00:00:00';
		var endDate = endDate + '-31 23:59:59';
		var state = syncReq({
			method: "GET",
			url: '/order/shop/month/report?parameter={"openid":"' + openid + '","startDate":"' + startDate + '","endDate":"' + endDate + '"}'
		});
		console.log('当天营业统计列表', state.data);
		res.json(state.data);
	},
	getSatisticsDetail: function(req, res) {
		var query = req.query,
			openid = req.session.openid,
			date = query.date;
		var startDate = date + ' 00:00:00';
		var endDate = date + ' 23:59:59';
		console.log('选中的时间段', startDate + ' ' + endDate);
		var state = syncReq({
			method: "GET",
			url: '/order/shop/month/report?parameter={"openid":"' + openid + '","startDate":"' + startDate + '","endDate":"' + endDate + '"}'
		});
		console.log(date + '营业明细', state.data);
		res.json(state.data);
	},
	toSettledPlatformUserinfo: function(req, res) {
		var query = req.query,
			openid = req.session.openid;
		var state = syncReq({
			method: "GET",
			url: '/shop/shopmember/' + openid
		});
		console.log('店铺信息', state.data);

		res.render("h5/settled/platform/userinfo", {
			data: state.data.data[0]
		});
	},
	//TODO 2016-11-29 新增 签到模块 王景麒
	missionSignin: function(req, res) {
		var request = req.query;
		var memberid = request.memberid;
		var shopcode = request.shopcode;
		var type = request.type;
		//TODO result 返回结果
		//返回1：{"status":205,"message":"execute successfully!"} 执行成功
		//返回2：{"status":415,"message":"today has been sign!"} 今天已经签到过
		//返回3：{"status":415,"message":"the ask has been disabled!"} 任务已经失效
		var result = syncReq({
			method: util.METHOD_GET,
			url: "/member/walk/sign",
			data: {
				memberid: memberid,
				shopcode: shopcode,
			}
		});
		console.log(result);
		//		res.json(result);
//		var _parms = [
//				'memberid=' + memberid,
//				'shopcode=' + shopcode,
//				'type=' + type,
//			];
		//		res.json('/h5/?'+_parms.join('&'));
		//		res.redirect('/h5/bf22e28c896a4a75b0cdc2fa5d450c01?' + _parms.join('&'));
		//		res.redirect('/h5/?' + _parms.join('&'));
		res.redirect('/h5/adv?id=qiandao');
	},
	//TODO 2016-12-31 新增广告页
	adv: function(req, res) {
		var query = req.query,
			advid = query.id;
		console.log('广告id', advid);
		var rtnData = {};
		if(advid){
			rtnData.id = advid;
		}
		console.log(rtnData);
		res.render('h5/adv',rtnData);
	},
	//TODO 2016-12-31 新增核销板块 王景麒
	//核销登录
	approvedSalesLogin: function(req, res) {
		var body = req.body,
			account = body.account,
			password = body.password;
		//		var result = syncReq({
		//			method: "POST",
		//			url: "/index/login",
		//			data: {
		//				username: account,
		//				password: password,
		//			}
		//		});
		//			if(!result.status || result.data.status!=201){
		//				res.json({
		//					status:false,
		//					msg:'登录失败'
		//				});
		//				return;
		//			}
		//			var rsData = result.data.data;

		//			console.log(rsData);
		var member = {
			account: account,
			password: password
		};
		res.cookie('approvedSalesMember', member, {
			maxAge: 31536000000 //一年
		});
		res.json({
			status: true
		});
	},
	//核销
	toApprovedSales: function(req, res) {
		//		res.cookie('approvedSalesMember', null, {
		//			maxAge: 0 //马上删除
		//		});
		var cardnum = req.params.cn,
			shopmember = req.cookies.approvedSalesMember;
		if(!shopmember) {
			res.render("h5/approvedSales/login");
			return;
		}
		var result = syncReq({
			method: "PUT",
			url: "/coupons/close",
			data: {
				cardnum: cardnum,
				cname: shopmember.account,
				cpassword: shopmember.password,
			}
		});
		console.log('核销返回', result);

		//返回数据
		var rtnData = {
			refurbish: false,
			nowtime: new Date().toLocaleString(),
			cn: cardnum
		};
		var data = result.data;
		if(!result.status) {
			if(result.msg.indexOf('账户名或密码错误') >= 0) {
				rtnData.refurbish = true;
				rtnData.msg = '账户名或密码错误，请重新登录。'
				res.cookie('approvedSalesMember', null, {
					maxAge: 0 //马上删除
				});
			} else {
				rtnData.msg = '操作失败，请稍后尝试。'
			}
		} else {
			rtnData.totalnum = data.totalnum;
			rtnData.conversionnum = data.conversionnum;
			rtnData.closenum = data.closenum;
			rtnData.overduenum = data.overduenum;
			rtnData.title = data.title;
			//成功
			if(!data.message){
				rtnData.msg = '核销成功'
			}else{
				rtnData.msg = "核销失败："+data.message;
			}
			
		}

		res.render("h5/approvedSales/index", {
			data: rtnData
		});

	},

}

/**
 * 调用此方法时，请确定id和sku不为空
 */
function getCommodities(id, sku) {
	if(COMMODITES.length === 0) {
		var result = syncReq({
			method: util.METHOD_GET,
			url: "/web/commodity/" + id,
		});
		if(result.status) {
			COMMODITES = result.data.data;
		}
	}
	for(var i = 0; i < COMMODITES.commodities.length; i++) {
		COMMODITES.commodities[i].name = COMMODITES.name;
		// var imgpath = COMMODITES.commodities[i].imagepath;
		// COMMODITES.commodities[i].imagepath = imgpath?JSON.parse(imgpath).IMG[0]: null;
		if(COMMODITES.commodities[i].sku === sku) return COMMODITES.commodities[i];
	}
}
// 对象空检查
function isEmpty(obj) {
	for(var i in obj) return !1;
	return !0;
}