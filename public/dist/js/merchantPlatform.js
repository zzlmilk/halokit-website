mui.init();
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});

//元素
var container_SigninList = mui('#tabbar-signin .mui-scroll');

//循环初始化所有下拉刷新，上拉加载。
//mui.each(document.querySelectorAll('.mui-scroll'), function(index, pullRefreshEl) {
//	mui(pullRefreshEl).pullToRefresh({
//		down: {
//			callback: function() {
//				var self = this;
//				setTimeout(function() {
//					var ul = self.element.querySelector('.mui-table-view');
//					ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
//					self.endPullDownToRefresh();
//				}, 1000);
//			}
//		},
//		up: {
//			callback: function() {
//				var self = this;
//				setTimeout(function() {
//					var ul = self.element.querySelector('.mui-table-view');
//					ul.appendChild(createFragment(ul, index, 6));
//					self.endPullUpToRefresh();
//				}, 1000);
//			}
//		}
//	});
//});
mui('#tabbar-signin .mui-scroll').pullToRefresh({
	down: {
		callback: function() {
			var self = this;
			createFragment_SigninList(self, true)
		}
	},
	//	up: {
	//		callback: function() {
	//			var self = this;
	//			setTimeout(function() {
	//				var ul = self.element.querySelector('.mui-table-view');
	//				ul.appendChild(createFragment(ul, index, 6));
	//				self.endPullUpToRefresh();
	//			}, 1000);
	//		}
	//	}
});
//创建签到列表
var createFragment_SigninList = function(container, isAppend) {
	var ul = container.element.querySelector('.mui-table-view')
	if(isAppend === true) {
		ul.innerHTML = '';
	}
	mui.ajax('getTodaySigninList', {
		async: true,
		dataType: 'json', //服务器返回json格式数据
		success: function(data) {
			console.log(['今日签到', data]);
			//循环添加数据
			var datalist = data.data;
			var fragment = document.createDocumentFragment();
			if(datalist.length <= 0) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.innerHTML = '<a href="javascript:;" class="mui-text-center">暂无新的签到</a>';
				fragment.appendChild(li);
			} else {
				for(var i = 0; i < datalist.length; i++) {
					//				var date = new Date(datalist[i].createDate);
					//				date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell';
					li.innerHTML = '<a href="javascript:;">' +
						'<img class="mui-media-object mui-pull-left" src="' + datalist[i].imagePath + '">' +
						'<div class="mui-media-body">' +
						datalist[i].petnicename +
						'<p class="mui-ellipsis fm-arial">' + datalist[i].createDate + '</p>' +
						'</div>' +
						'<button class="mui-btn mui-btn-primary" idx="' + datalist[i].id + '" onclick="signin(this);">确认</button>' +
						'</a>';

					fragment.appendChild(li);
				}
			}
			ul.appendChild(fragment);
			container.endPullDownToRefresh();
			//设置今日签到与今日未确认签到
			mui('#tabbar-signin .dashboard .left .number')[0].innerText = data.count;
			mui('#tabbar-signin .dashboard .right .number')[0].innerText = datalist.length;
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});

};

//确认签到
function signin(ele) {
	var id = ele.getAttribute('idx');
	console.log(['当前确认签到id', id]);
	mui.ajax('signinConfirm', {
		async: true,
		data: {
			id: id
		},
		dataType: 'json', //服务器返回json格式数据
		success: function(data) {
			console.log(data);
			if(!data.status) {
				mui.toast('操作失败，请关闭页面后重新尝试');
				return;
			}
			ele.parentNode.parentNode.parentNode.removeChild(ele.parentNode.parentNode);
			mui.toast('操作成功');
			mui('#tabbar-signin .dashboard .right .number')[0].innerText = ele.parentNode.querySelectorAll('li').length;
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});
}
//一键签到
mui(document.body).on('tap', '#btn-Signin', function(e) {
	var elebg = this.childNodes[1];
	console.log(['bg元素', this.childNodes[1]]);
	alert(this.innerText);
	//			ToggleClass(elebg,'spinner');
});
//有则去除类 无责增加类
function ToggleClass(selector, className) {
	var ele = mui(selector)[0];
	if(!ele) {
		throw new Error("undefind elemengt" + selector);
	}
	if(!className || className.replace(/ /g, '') == '') {
		return;
	}
	//获取元素class字符串
	var eleClassName = ele.className;
	//class转化为数组
	var eleClassNameArr = eleClassName.split(' ');
	//寻找是否存在此class
	var isHasFlag = false;
	var isHasIndex = -1;
	for(var i = 0; i < eleClassNameArr.length; i++) {
		if(eleClassNameArr[i] === className) {
			isHasFlag = true;
			isHasIndex = i;
			break;
		}
	}

	//如果存在 删除 否则添加
	if(isHasFlag) {
		delete eleClassNameArr[isHasIndex];
	} else {
		eleClassNameArr[eleClassNameArr.length] = className;
	}

	ele.className = eleClassNameArr.join(' ');

}

//选择器
var btns = mui('.datePicker');
btns.each(function(i, btn) {
	btn.addEventListener('tap', function() {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		var ele = mui(this);
		/*
		 * 首次显示时实例化组件
		 * 示例为了简洁，将 options 放在了按钮的 dom 上
		 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
		 */
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			/*
			 * rs.value 拼合后的 value
			 * rs.text 拼合后的 text
			 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
			 * rs.m 月，用法同年
			 * rs.d 日，用法同年
			 * rs.h 时，用法同年
			 * rs.i 分（minutes 的第二个字母），用法同年
			 */
			//					result.innerText = '选择结果: ' + rs.text;
			/* 
			 * 返回 false 可以阻止选择框的关闭
			 * return false;
			 */
			ele[0].querySelector('.selectDate').innerText = rs.text;
			/*
			 * 释放组件资源，释放后将将不能再操作组件
			 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
			 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
			 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
			 */
			picker.dispose();
		});
	}, false);
});

//商户统计 初始化单页view
var viewApi = mui('#statistics-app').view({
	defaultPage: '#statistics-list'
});
//处理view的后退
mui.back = function() {
	if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
		viewApi.back();
	}
};
//mui('#statisticsDetail-list header').on('tap','.back',function(e){
////	if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
//		
////	}
//})