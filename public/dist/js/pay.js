new loader(["/dist/js/jq.js","/dist/js/base.js","http://pv.sohu.com/cityjson?ie=utf-8"],function(e){var t=$("#pay-layer"),i=null;t.on("click","#pay-btn",function(e){var r=Base.parseForm(t,".form-data");r.payment=payment,r.commodities=commodities,r.spbill_create_ip=returnCitySN.cip,r.recipientname&&/^1(3|4|5|7|8)[0-9]\d{8}$/.test(r.recipientcontact)&&r.recipientaddress?($(".err-word").hide(),i=Base.setTip("生成订单中..."),$.ajax({url:"/h5/pay",type:"POST",contentType:"application/json;charset=utf-8",data:JSON.stringify(r),success:function(e){i.hide(),e.status?n.onBridgeReady(e.data):$(".err-word").text("订单生成失败，请重新下订单").show()},error:function(e){i.hide(),$(".err-word").text("网络错误，请重试").show()}})):$(".err-word").text("请填写完整的信息").show()});var n={onBridgeReady:function(e){function t(){WeixinJSBridge.invoke("getBrandWCPayRequest",e,function(e){i.hide(),"get_brand_wcpay_request:ok"===e.err_msg?n.redirect(!0):n.redirect(!1)})}"prepay_id=undefined"===e["package"]?(alert("商户订单重复"),n.redirect("false")):(i.text("支付中...").show(),"undefined"==typeof WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",t,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",t),document.attachEvent("onWeixinJSBridgeReady",t)):t())},redirect:function(e){e||$(".err-word").text("支付失败").show(),setTimeout(function(){location.href="/h5/personal?status="+(e?"CUSTPAY":"CUSTCONFIRM")},600)}}}).jsLoader();