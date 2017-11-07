new loader(["/dist/js/jq.js", "/dist/js/base.js", "http://pv.sohu.com/cityjson?ie=utf-8"], function(e) {
	var $layer = $("#pay-layer"),
		_tip = null;
	// 隐藏提示
	// $(".err-word").hide();
	//启动先获取上次本地缓存的发货地址
	$(document).ready(function() {
		var recipientInfoData = JSON.parse(localStorage.getItem(memberid));
		//		console.log(recipientInfoData);
		if(!memberid || !recipientInfoData || recipientInfoData.memberid != memberid) {
			localStorage.removeItem(memberid);
			return;
		}
		$("input[name='recipientname']").val(recipientInfoData.name);
		$("input[name='recipientcontact']").val(recipientInfoData.contact);
		$("input[name='recipientaddress']").val(recipientInfoData.address);
	});
	// 事件绑定
	$layer.on("click", "#pay-btn", function(e) {
		var data = Base.parseForm($layer, ".form-data");
		data.payment = payment;
		data.commodities = commodities;
		data.spbill_create_ip = returnCitySN.cip;
		if(type) {
			data.type = type;
			data.shopcode = shopcode;
		} else if(!type && shopcode) {
			data.shopcode = shopcode;
		}
		//      console.log(data);
		if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(data.recipientcontact)) {
			$(".err-word").text("手机号码输入错误,请检查").show();
			return;
		}
		if(data.recipientname && /^1(3|4|5|7|8)[0-9]\d{8}$/.test(data.recipientcontact) && data.recipientaddress) {
			$(".err-word").hide();
			_tip = Base.setTip("生成订单中...");
			$.ajax({
				url: '/h5/pay',
				type: 'POST',
				contentType: "application/json;charset=utf-8",
				data: JSON.stringify(data),
				success: function(e) {
					_tip.hide();
					console.log(e);
					if(e.status) {
						//						console.log(['type',type]);
						if(type) {
							//调用app
							if(type === 'ios') {
								//								alert("objc://toPay?" + JSON.stringify(e.data));
								window.location.href = "objc://toPay?" + JSON.stringify(e);
							} else if(type === 'android') {
								//								alert('android.toPay '+JSON.stringify(e.data));
								android.toPay(JSON.stringify(e));
							}
						} else {
							Pay.onBridgeReady(e.data);
						}

					} else {
						$(".err-word").text("订单生成失败，请重新下订单").show();
					}
				},
				error: function(e) {
					_tip.hide();
					$(".err-word").text("网络错误，请重试").show();
				}
			})

			//window.location.href = "/h5/pay?data=" + JSON.stringify(data);
		} else {
			$(".err-word").text("请填写完整的信息").show();
		}
	}).on('keyup', '.form-data', function() {
		var data = Base.parseForm($layer, ".form-data");
		var recipientInfoData = JSON.parse(localStorage.getItem(data.memberid));
		if(!recipientInfoData) {
			recipientInfoData = {
				memberid: memberid
			};
		}
		recipientInfoData.name = data.recipientname;
		recipientInfoData.contact = data.recipientcontact;
		recipientInfoData.address = data.recipientaddress;
		recipientInfoData.postcode = data.recipientpostcode;
		localStorage.setItem(memberid, JSON.stringify(recipientInfoData));
	});

	var Pay = {
		onBridgeReady: function(payArgs) {
			console.log(payArgs);
			// 弹出微信支付窗口
			if(payArgs.package === 'prepay_id=undefined') {
				alert("商户订单重复");
				//				console.log("商户订单重复");
				// layer.open({ content: '商户订单号重复' });
				if(!type) {
					Pay.redirect(false);
				}
			} else {
				_tip.text("支付中...").show();

				function onBridgeReady() {
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest',
						payArgs,
						function(res) {
							_tip.hide();
							if(res.err_msg === "get_brand_wcpay_request:ok") {
								//layer.open({ content: '支付成功' });
								Pay.redirect(true);
							} else {
								// layer.open({ content: '支付失败' });
								Pay.redirect(false);
							}
						}
					);
				}

				if(!type) {
					if(typeof WeixinJSBridge == "undefined") {
						if(document.addEventListener) {
							document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
						} else if(document.attachEvent) {
							document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
							document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
						}
					} else {
						onBridgeReady();
					}
				}

			}
		},
		redirect: function(_status) {
			if(!_status) {
				$(".err-word").text("支付失败").show();
			}
			setTimeout(function() {
				location.href = "/h5/personal?status=" + (_status ? "CUSTPAY" : "CUSTCONFIRM");
			}, 600);
		}
	};

}).jsLoader();

function UUID(len) {
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
}