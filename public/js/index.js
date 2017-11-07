new loader(["/dist/js/jq.js", "/dist/js/base.js", "/dist/js/myalert.js"], function(e) {
	// -------hangyangws[图片轮播及事件]---------------
	/**
	 * Created by hangyangws(hangyangws@foxmail.com) in 2016-08-19.
	 */
	// 项圈轮播
	var $win = $(window || this), // window
		$ringCon = $('#ringCon'), // 轮播移动DOM
		$ringList = $ringCon.find('li'), // 轮播元素
		_origin_list_len = $ringList.length,
		_move_width = $win.width() / 3,
		_move_css = '{"-webkit-transform": "translate3d(-${x}px, 0, 0)","-moz-transform": "translate3d(-${x}px, 0, 0)","-o-transform": "translate3d(-${x}px, 0, 0)","transform": "translate3d(-${x}px, 0, 0)"}',
		Ring = {
			init: function() {
				// 给li宽度赋值33%屏幕
				this.itemWidth();
				// 添加首尾图片
				$ringCon.append($ringList.first().clone());
				$ringCon.prepend($ringList.last().clone());
				$ringList = $ringCon.find('li');
				$ringList.eq(1).addClass('ring-scale');
			},
			itemWidth: function() {
				_move_width = $win.width() / 3;
				$ringList.width(_move_width);
			},
			change: function() {
				var $this = $(this),
					_index = $this.index();
				console.log(['图片id', _index]);
				if(!$this.is('.ring-scale')) {
					if(_index === 0) {
						Ring.move($ringList.eq(_origin_list_len), (_origin_list_len - 1) * _move_width);
					}
					if(_index === _origin_list_len + 1) {
						Ring.move($ringList.eq(1), 0);
						return;
					}
					if(_index > 0 && _index < _origin_list_len + 1) { // 原始元素点击
						Ring.move($this, (_index - 1) * _move_width);
						return;
					}
				}
			},
			move: function($this, _x) {
				$ringCon.css(JSON.parse(_move_css.replace(/\${x}/g, _x)));
				$ringCon.find('.ring-scale').removeClass('ring-scale');
				$this.addClass('ring-scale');
			}
		};
	Ring.init(); // 轮播图初始化
	$win.on('resize', Ring.itemWidth);
	$ringCon.on('touchend', 'li', Ring.change); // 项圈点击
	// -------hangyangws---------------end
	var $selection = $("#selection"),
		_size_id = $selection.find(".choose-size").first().addClass("checked").data("id"),
		template = new Base.template();

	// 初始化
	var _check_id = null,
		_to_cart = "/h5/cart?id=";
	fn_check(_size_id, 0);
	// 选中颜色的方法
	function fn_check(id, num) {
		num = num ? num : 0;
		var $_check = $selection.find("#" + id + " .block").eq(num);
		$(".tip-price").html("商品下架");
		_check_id = $_check.data("id");
		// 选中
		$_check.addClass("checked").siblings().removeClass("checked");
		// 切换产品图片
		$ringCon.find('.' + $_check.data('color')).eq(0).trigger('touchend');
		// 不可选
		if(!$_check.hasClass("disabled")) {
			$(".tip-price").html($_check.data("price") + "元");
		}
		$(".color-board").hide();
		$("#" + id).show();

		if($("#" + id + " .checked:not(.disabled)").length < 1) {
			$("#add-to-cart").addClass("disabled");
		} else {
			$("#add-to-cart").removeClass("disabled");
		}
	}

	// 用户交互事件
	$selection.on("touchend", ".choose-size", function(e) { // 选中尺寸
		$(this).addClass("checked").siblings().removeClass("checked");
		// 获取选中颜色
		var _id = $(this).data("id");
		// var _index = $selection.find("#" + _id + " .checked").index();
		// _index = _index ? _index : 0;
		fn_check(_id, 0);
	}).on("touchend", ".color-board .block", function(e) { // 选中颜色
		// if ($(this).hasClass("disabled")) return false;
		$(this).addClass("checked").siblings().removeClass("checked");
		_check_id = $(this).data("id");
		$(".tip-price").html("商品下架");
		// 激活加入购物车按钮
		if(!$(this).hasClass("disabled")) {
			$(".tip-price").html($(this).data("price") + "元");
			$("#add-to-cart").removeClass("disabled");
		} else {
			$("#add-to-cart").addClass("disabled");
		}
		// -------hangyangws[图片颜色联动]---------------
		$ringCon.find('.' + $(this).data('color')).eq(0).trigger('touchend');

		// -------hangyangws---------------------  -end
	}).on("touchend", "#add-to-cart", function(e) { // 加入购物车按钮
		if(!$(this).hasClass("disabled")) {
			// 提示
			//     $("body").halokitAlert({
			//         content: template.get("confir_dialog", {
			//             title: "提示",
			//             content: "请选择商品颜色",
			//         }),
			//         closeBtn: ".confirm-btn"
			//     });
			// 请求
			//TODO 20170113 目前仅支持微信与app端购买 提示用户仅支持微信
			if(type != '' || isWeiXin()){
				window.location.href = _to_cart + commodity_id + "&sku=" + _check_id + "&" + window.location.href.split('?')[1];
			}else{
				$("body").halokitAlert({
					content: template.get("confir_dialog", {
						title: "温馨提醒",
						content: "请使用微信扫码进入购买可点宠物项圈",
					}),
					closeBtn: ".confirm-btn"
				});
			}
		}
	});
}).jsLoader();

function isWeiXin() {
	return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
}