new loader(["/dist/js/jq.js", "/dist/js/base.js", "http://pv.sohu.com/cityjson?ie=utf-8"], function(e) {
    var $layer = $("#personal"),
        _tip = null;
    // 隐藏提示
    // $(".err-word").hide();
    // 事件绑定
    $layer.on("click", ".pay-btn.pay", function(e) {
        var data = {
            orderSn: $(this).data("ordersn"),
            spbill_create_ip: returnCitySN.cip
        };
        if (data.orderSn && data.spbill_create_ip) {
            _tip = Base.setTip("查询订单中...");
            $.ajax({
                url: '/h5/payByOrderSn',
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(data),
                success: function(e) {
                	_tip.hide();
                	if(e.status){
                		Pay.onBridgeReady(e.data);
                	}else{
                		$(".err-word").text(e.msg).show();
                	}
                },
                error: function(e) {
                    _tip.hide();
                    $(".err-word").text("网络错误，请重试").show();
                }
            })

            //window.location.href = "/h5/pay?data=" + JSON.stringify(data);
        } else {
            $(".err-word").text("订单有误，请刷新页面").show();
        }
    }).on("click", ".send-btn", function(e){
        var _id = $(this).data("id");
        if(!confirm("此操作不可撤销，点击确定继续，点击取消返回")) return;
        if(!_id ){
            $(".err-word").text("订单有误，请刷新页面").show();
        }
        _tip = Base.setTip("查询订单中...");
        $.get("/h5/refund/" + _id, function(e){
            _tip.hide();
            if(e.status){
                // 跳转链接
                window.location.reload();
            }else{
                $(".err-word").text(e.msg).show();
            }
        })

    }).on("click", ".sure-btn", function(e){
        if(!confirm("此操作不可撤销，点击确定继续，点击取消返回")) return;
        var id = $(this).data("id");
        if(id){
            // 更改状态
            var _url = [
                "/h5/send/",
                id,
                "?status=",
                "CUSTRECEIVE"
            ];
            _tip = Base.setTip("查询订单中...");
            $.get(_url.join(""), function(e){
                _tip.hide();
                if(e.status){
                    window.location.reload();
                }else{
                    $(".err-word").text(e.msg).show();
                }
            });
        }else{
            // 
            $(".err-word").text("订单有误，请刷新页面").show();
        }
    });


    var Pay = {
        onBridgeReady: function(payArgs) {
            // 弹出微信支付窗口
            if (payArgs.package === 'prepay_id=undefined') {
            	alert("商户订单重复");
                // layer.open({ content: '商户订单号重复' });
                Pay.redirect('false');
            } else {
                _tip.text("支付中...").show();
                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        payArgs,
                        function(res) {
                            _tip.hide();
                            if (res.err_msg === "get_brand_wcpay_request:ok") {
                                //layer.open({ content: '支付成功' });
                                Pay.redirect(true);
                            } else {
                                // layer.open({ content: '支付失败' });
                                Pay.redirect(false);
                            }
                        }
                    );
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            }
        },
        redirect: function(_status) {
            if(!_status){
                $(".err-word").text("支付失败").show();
            }
            setTimeout(function() {
                location.href = "/h5/personal?status=" + (_status?"CUSTPAY":"CUSTCONFIRM");
            }, 600);
        }
    };

}).jsLoader();
