/**
 * Created by KekiWang(keki91jq@foxmail.com) in 2017-02-10.
 */

var syncReq = require("../util/pub").syncReq,
	wx = require("../weixin/wx");

module.exports = {
	init: function(req, res) {
		var query = req.query,
			result = wx.getOpenId(req),
			//			wxuserinfo = wx.getUserInfo(req),
			//			unionid = req.session.unionid,
			type = query.type;
		req.session.type = type
			//		console.log('用户微信授权信息', wxuserinfo);
		res.render('register/index', {
			type: type
		});
	},
	register: function(req, res) {
		var query = req.query,
			result = wx.getOpenId(req),
			wxuserinfo = wx.getUserInfo(req),
			unionid = req.session.unionid,
			type = req.session.type, //微信等第三方才会存在
			info = {
				status: false,
				msg: ''
			},
			phone = req.body.phone,
			code = req.body.code,
			petnikename = req.body.petnikename,
			unionid = req.session.unionid,
			platform = 1; //平台类型 1:微信 2:微博 3:QQ
		console.log("注册来了>>>", req.body);
		// 业务    
		try {
			if(!type && unionid) {
				var wxheadimg;
				if(!wxuserinfo.headimgurl||wxuserinfo.headimgurl==''){
					wxheadimg = '';
				}else{
					wxheadimg = '{"IMG":["'+wxuserinfo.headimgurl+'"]}';
				}
				// 查询通过三方登录的账号
				var params = {
					url: "/index/tplogin",
					method: "POST",
					data: {
						halokitauthplatforms: [{
							platformtype: platform,
							authid: unionid
						}],
						halokitmemberext: [{
							nickname: wxuserinfo.nickname,
							imagepath: wxheadimg,
							sex: wxuserinfo.sex,
							city: wxuserinfo.city,
						}],
						mobile: phone,
						authcode: code,
					}
				};
				info = syncReq(params);
				//如果没有宠物
				//				console.log('宠物',info.data.data.halokitpets);
				var pets = info.data.data.halokitpets;
				if(!pets || pets.length <= 0) {
					var petRs = syncReq({
						url: "/pet",
						method: "POST",
						data: {
							nickname: petnikename,
							memberid: info.data.data.id,
							weight: 50
						}
					});
//					console.log('宠物注册信息', petRs);
				}
			} else {
				var params = {
					url: "/member",
					method: "POST",
					data: {
						mobile: phone,
						loginpassword: password
					}
				};
				info = syncReq(params);

				if(info.status) {
					info.msg = "注册成功,跳转中...";
					res.json(info);
					return;
				}
			}

//			console.log("成功返回", info);

		} catch(e) {
			console.log(e);
			info.msg = "系统繁忙，请稍后";
		}
		info = {
			status: true,
			msg: '注册成功'
		}
		res.json(info);
	}
}