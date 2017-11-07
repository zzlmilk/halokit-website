var prefix = "/";
new loader([
	prefix + "img/icon.png",
	prefix + "img/bg1.png",
	prefix + "img/bg-3-1.png",
	prefix + "img/bg-3-2.png",
	prefix + "img/borad.png",
	prefix + "img/gui.png",
	prefix + "img/line1.png",
	prefix + "img/next.png",
	prefix + "img/phone.png",
	prefix + "img/ring1.png",
	prefix + "img/ring2.png",
	prefix + "img/ring3.png",
	prefix + "img/ring4.png",
	prefix + "img/ring-white.png",
	prefix + "img/welcome.png"
], function(e) {
	// 移除加载动画
	document.body.removeChild(document.getElementById("loading"));

	// 显示第一组动画
	var s1 = document.getElementById("sceen-1");
	s1.setAttribute("class", s1.getAttribute("class").replace(/hide/g, ""));

	// 浏览器高度
	var WH = document.documentElement.clientHeight || document.body.clientHeight;

	// 阻止浏览器默认事件
	document.body.addEventListener("touchstart", function(e) {
		e.preventDefault();
	});

	// 第二个场景
	document.getElementById("next").addEventListener("touchend", function(e) {
		var _one = document.getElementById("sceen-1-1"),
			_two = document.getElementById("sceen-1-2"),
			_bg = document.getElementById("sceen-1-bg");
		_one.setAttribute("class", "hide");
		_two.setAttribute("class", _two.getAttribute("class").replace(/hide/g, ""));
		_bg.setAttribute("class", _bg.getAttribute("class") + " filter");
	})

	// 第三个场景
	document.getElementById("next2").addEventListener("touchend", function(e) {
		var _now = document.getElementById("sceen-1"),
			_next = document.getElementById("sceen-2");
		_now.setAttribute("class", _now.getAttribute("class") + " hide");
		_next.setAttribute("class", _next.getAttribute("class").replace(/hide/g, ""));
	})

	// 文本显示区自适应高度
	document.getElementById("resize-word").style.height = (WH - 900) + "px";

	// 控制二组里面的切换
	var _sceen1 = document.getElementById("sceen-2"),
		_scroll = document.getElementById("slider-box"),
		_sceens = _scroll.getElementsByClassName("item"),
		_words = document.getElementById("resize-word").getElementsByClassName("item"),
		index = 0;
	var oldP = {
		x: 0,
		y: 0
	};
	
	_sceen1.addEventListener("touchstart", function(e) {
		oldP.x = e.touches[0].clientX;
		oldP.y = e.touches[0].clientY;
	})

	// 切换动画
	_sceen1.addEventListener("touchend", function(e) {
		var x = e.changedTouches[0].clientX - oldP.x,
			y = e.changedTouches[0].clientY - oldP.y;
		if(y < -50 && index > 0) {
			_sceens[index].setAttribute("class", _sceens[index].getAttribute("class") + " hide");
			_words[index].setAttribute("class", _words[index].getAttribute("class") + " hide");
			// 下一帧
			_sceens[--index].setAttribute("class", _sceens[index].getAttribute("class").replace(/hide/g, ""));
			_words[index].setAttribute("class", _words[index].getAttribute("class").replace(/hide/g, ""));
		}
		if(y > 50 && index < (_sceens.length - 1)) {
			_sceens[index].setAttribute("class", _sceens[index].getAttribute("class") + " hide");
			_words[index].setAttribute("class", _words[index].getAttribute("class") + " hide");
			// 下一帧
			_sceens[++index].setAttribute("class", _sceens[index].getAttribute("class").replace(/hide/g, ""));
			_words[index].setAttribute("class", _words[index].getAttribute("class").replace(/hide/g, ""));
			return;
		}
		//		if(y >50 && index + 1 === (_sceens.length)) {
		//
		//			// 跳转页面，到购买页面
		//			location.href = "/h5/bf22e28c896a4a75b0cdc2fa5d450c01"
		//		}
	})

}).imgLoader();