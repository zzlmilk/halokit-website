/**
 * created by hanghangws in 2016-01-29
 */

var payConf = require('../../conf/wxpay'),
	util = require('../util/util'),
	syncReq = require('../util/pub').syncReq,
	fs = require('fs'),
	wxPay = require('weixin-pay')({
		appid: payConf.WX_APPID,
		mch_id: payConf.WX_MCH_ID,
		partner_key: payConf.WX_MCH_KEY,
		pfx: fs.readFileSync(payConf.WX_PFX_PATH)
	}),
	wxPayToWOP = require('weixin-pay')({
		appid: payConf.WX_WOP_APPID,
		mch_id: payConf.WX_WOP_MCH_ID,
		partner_key: payConf.WX_WOP_MCH_KEY,
	});

module.exports = {
	pay: function(req, res) {
		if(req.session.memberid && req.query.body) {
			console.log('===支付请求的参数请求的query===');
			console.log(req.query);
			var _pay_obj = {
				openid: req.query.openid,
				body: req.query.body,
				out_trade_no: req.query.out_trade_no,
				total_fee: req.query.total_fee,
				spbill_create_ip: req.query.spbill_create_ip,
				notify_url: payConf.PAY_NOTIFY_URL,
				// sub_mch_id: "1332669001"
				nonce_str: util.UUID(32),
			};
			console.log('===微信商城发起支付对象===');
			console.log(_pay_obj);
			wxPay.getBrandWCPayRequestParams(_pay_obj, function(err, result) {
				console.log('===微信商城支付返回对象===');
				console.log(result);
				res.json({
					status: true,
					data: result
				})
			});
		} else {
			// 登录之前需要保存请求url
			res.json({
				status: false
			})
		}
	},
	toAppPay: function(req, res) {
		if(req.session.memberid && req.query.body) {
			console.log('===支付请求的参数请求的query===');
			console.log(req.query);

			var _pay_obj = {
				body: req.query.body,
				out_trade_no: req.query.out_trade_no,
				total_fee: req.query.total_fee,
				spbill_create_ip: req.query.spbill_create_ip,
				notify_url: payConf.PAY_NOTIFY_URL,
				//sub_mch_id: "1332669001"
				nonce_str: util.UUID(32),
			};
			console.log('===微信商城发起支付对象===');
			console.log(_pay_obj);

			wxPayToWOP.getBrandWCPayRequestParamsForApp(_pay_obj, function(err, result) {
				console.log('===微信商城支付返回对象===');
				console.log(result);
				if(!result.prepayid || typeof(result.prepayid) == undefined) {
					res.json({
						status: false,
						msg: '商户订单号重复'
					});
					return;
				}
				console.log('===返回对象===');
				var _rtnData = {
					appid: result.appid,
					partnerid: result.partnerid,
					prepayid: result.prepayid,
					packageValue: result.package,
					noncestr: result.noncestr,
					timestamp: result.timestamp,
					sign: result.paySign,
				};
				console.log(_rtnData);
				res.json({
					status: true,
					data: _rtnData
				});
			});
		} else {
			// 登录之前需要保存请求url
			res.json({
				status: false,
				msg: '数据错误'
			})
		}
	},
	qr: function(product_id) {
		return wxPay.createMerchantPrepayUrl({
			product_id: product_id
		});
	},
	refund: function(req, res) {
		var params = {
			nonce_str: util.UUID(32),
			appid: payConf.WX_APPID,
			mch_id: payConf.WX_MCH_ID,
			op_user_id: payConf.WX_MCH_ID,
			out_refund_no: req.query.refundsn,
			total_fee: req.query.paydamount, //原支付金额
			refund_fee: req.query.refundamount, //退款金额
			transaction_id: req.query.transactionid
		};

		wxPay.refund(params, function(err, result) {
			var _req = {
				status: false
			}
			if(result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
				_req = syncReq({
					method: "POST",
					url: "/web/refund/callback",
					data: {
						refundsn: result.out_refund_no,
						transactionrefundid: result.refund_id,
						transactionid: result.transaction_id
					}
				});
			} else {
				_req.msg = result.err_code_des;
			}

			console.log("退款申请返回结果： 》》》 ", _req);

			res.json(_req);

		});
	},
	notify: function(msg, res) {
		console.log('===微信支付发起的通知消息（对比是不是和发起的一样）===');
		console.log(msg);
		if(msg.return_code === 'SUCCESS' && msg.result_code === 'SUCCESS') {
			var _req = syncReq({
				method: "POST",
				url: "/web/payment/callback",
				data: {
					ordersn: msg.out_trade_no,
					paymentamount: msg.cash_fee / 100,
					paymenttime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
					platformtype: "WECHAT",
					transactionid: msg.transaction_id
				}
			});
			console.log(" 订单 ----> ", _req);
			if(_req.status) {
				res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
			} else {
				res.send('<xml><return_code><![CDATA[FAIL]]></return_code>');
			}
		} else {
			res.send('<xml><return_code><![CDATA[FAIL]]></return_code>');
		}
	}
};