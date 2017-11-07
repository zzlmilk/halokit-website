new loader(["/dist/js/jq.js", "/dist/js/base.js", "/dist/js/myalert.js"], function(e) {
	var $main = $("#section"),
		$submit = $("#submit-btn"),
		$delete = $("#delete-btn"),
		template = new Base.template(),
		mycount = {};

	function count() {
		var _result = {
			count: 0,
			num: 0
		};
		$(".check.checked:not(.check-all)").each(function() {
			var _id = $(this).parents("tr").data("id"),
				_price = parseFloat($(this).parents("tr").data("price"), 10),
				_num = ~~$(this).parents("tr").find(".number").text();
			_result.num += _num;
			_result.count += _price * _num;
		});

		// 1个每个优惠25
		// 2个每个优惠50
		// 3个以上包括3个，每个优惠75
		var benefi = 0;
		//TODO 2016-12-1 优惠临时去除 王景麒
//		if(_result.num === 1) {
//			benefi = 25;
//		} else if(_result.num === 2) {
//			benefi = 100;
//		} else if(_result.num >= 3) {
//			benefi = _result.num * 75;
//		}
		_result.count = (_result.count * 100 - benefi * 100) / 100;
		_result.benefi = benefi;
		// 算法
		console.log(_result);
		$("#cart-count").text(_result.count + " 优惠" + benefi);
		return _result;
	}
	mycount = count();
	$main.on("touchend", ".change-number .add", function(e) {
		$(this).siblings(".cut").removeClass("disabled");
		var $num = $(this).siblings(".number");
		$num.text(~~$num.text() + 1);
		mycount = count();
		return false;
	}).on("touchend", ".change-number .cut", function(e) {
		var $num = $(this).siblings(".number");
		$num.text(~~$num.text() - 1);
		if(~~$num.text() <= 1) {
			$num.text(1);
			$(this).addClass("disabled");
		}
		mycount = count();
		return false;
	}).on("touchend", ".check-item", function(e) {
		var $check = $(this).find(".check");

		// 全选按钮
		if($check.hasClass("check-all")) {
			if($check.hasClass("checked")) {
				$(".check-item .check").removeClass("checked");
			} else {
				$(".check-item .check").addClass("checked");
			}
			mycount = count();
			return true;
		}
		// 普通check项
		if($check.hasClass("checked")) {
			$check.removeClass("checked")
		} else {
			$check.addClass("checked")
		}
		// 检测普通选项全部选中
		if($(".check.checked:not(.check-all)").length === $(".check:not(.check-all)").length) {
			$(".check-item .check").addClass("checked");
		} else {
			$(".check-item .check-all").removeClass("checked");
		}
		mycount = count();
	}).on("touchend", "#submit-btn", function(e) {
		if(!mycount.num) {
			$("body").halokitAlert({
				content: template.get("confir_dialog", {
					"title": "提示",
					"content": "请选择一个购物车里面的商品"
				}),
				closeBtn: ".confirm-btn"
			});
			return;
		};

		var carts = [];
		$(".check.checked:not(.check-all)").each(function(e) {
			carts.push({
				id: $(this).parents("tr").data("id"),
				count: $(this).parents("tr").find(".number").text()
			});
		});

		var _obj = {
			name: "halo kit α",
			carts: carts,
			payment: mycount.count,
			benefi: mycount.benefi
		};
		
		var wechatScope = 'scope=snsapi_userinfo&';
		if(type){
			//微信清空
			wechatScope = '';
			_obj.memberid = memberid;
			_obj.shopcode = shopcode;
			_obj.type = type;
		}else if(!type && shopcode){
			_obj.shopcode = shopcode;
		}
		window.location.href = '/h5/toPay?'+wechatScope+'carts=' + JSON.stringify(_obj);

	}).on("touchend", "#delete-btn", function(e) { // 删除按钮
		var carts = [];
		$(".check.checked:not(.check-all)").each(function(e) {
			carts.push({
				id: $(this).parents("tr").data("id"),
				count: $(this).parents("tr").find(".number").text()
			});
		});

		$.ajax({
			url: "/h5/cart",
			type: 'POST',
			contentType: "application/json;charset=utf-8",
			data: JSON.stringify({
				carts: carts
			}),
			success: function(e) {
				if(e.status) {
					var parms = '';
					if(type) {
						parms = '?'+[
							'memberid=' + memberid,
							'shopcode=' + shopcode,
							'type=' + type
						].join('&');
					}
					window.location.href = "/h5/cart"+parms;
				} else {
					$("body").halokitAlert({
						content: template.get("confir_dialog", {
							"title": "提示",
							"content": e.msg,
						}),
						closeBtn: ".confirm-btn"
					})
				}

			},
			error: function(e) {
				$("body").halokitAlert({
						content: template.get("confir_dialog", {
							"title": "提示",
							"content": "删除购物车失败请重试",
						}),
						closeBtn: ".confirm-btn"
					})
					// $prompt.html("登陆失败，请重试");
			}
		})

	}).on("touchend", "#edit-btn", function(e) {
		if($(this).text() === "编辑") {
			$(this).text("选择");
			$("#delete-btn").show().removeClass("hidden");
			$("#submit-btn").hide();
		} else {
			$(this).text("编辑");
			$("#submit-btn").show().removeClass("hidden");
			$("#delete-btn").hide();
		}

	});

}).jsLoader();