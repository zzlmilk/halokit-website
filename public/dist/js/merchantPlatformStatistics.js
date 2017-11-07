mui.init();
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});

//初始化单页view
var viewApi = mui('#statistics-app').view({
	defaultPage: '#statistics-list'
//	defaultPage: '#statisticsDetail-list'
});

var view = viewApi.view;
(function($) {
	//处理view的后退与webview后退
	var oldBack = $.back;
	$.back = function() {
		if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
			viewApi.back();
		} else { //执行webview后退
			oldBack();
		}
	};
	//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
	//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
//	view.addEventListener('pageBeforeShow', function(e) {
//						console.log(e.detail.page.id + ' beforeShow');
//	});
//	view.addEventListener('pageShow', function(e) {
//						console.log(e.detail.page.id + ' show');
//	});
//	view.addEventListener('pageBeforeBack', function(e) {
//						console.log(e.detail.page.id + ' beforeBack');
//	});
//	view.addEventListener('pageBack', function(e) {
//						console.log(e.detail.page.id + ' back');
//	});
})(mui);

//元素
var container_list = mui('#statistics-list .mui-scroll');
var container_detailList = mui('#statisticsDetail-list .mui-scroll');
container_list.pullToRefresh({
	down: {
		callback: function() {
			var self = this;
			createFragment_list(self)
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
container_detailList.pullToRefresh({
	down: {
		callback: function() {
			var self = this;
			createFragment_detailList(self)
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
//创建营业统计列表
var createFragment_list = function(container, isAppend) {
	var ul = container.element?container.element.querySelector('.mui-table-view'):container[0].querySelector('.mui-table-view');
	if(!isAppend) {
		ul.innerHTML = '';
	}
	var startDate = mui('.startDate')[0].querySelector('.selectDate').innerText;
	var endDate = mui('.endDate')[0].querySelector('.selectDate').innerText;
	mui.ajax('getSatistics', {
		async: true,
		dataType: 'json', //服务器返回json格式数据
		data:{
			startDate:startDate,
			endDate:endDate,
		},
		success: function(data) {
			console.log(['营业统计', data]);
			//设置合计金额
			mui('#statistics-list .dashboard .number')[0].innerText = data.totalmoney;
			//循环添加数据
			var datalist = data.data;
			var fragment = document.createDocumentFragment();
			if(datalist.length <= 0) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.innerHTML = '<a href="javascript:;" class="mui-text-center">暂无新的数据</a>';
				fragment.appendChild(li);
			} else {
				for(var i = 0; i < datalist.length; i++) {
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell mui-media';
					li.innerHTML = '<a class="mui-navigate-right linkDetail" href="#statisticsDetail-list" data-date="'+datalist[i].day+'" onclick="getDetail(this);">'+
										'<div class="mui-table">'+
											'<div class="mui-table-cell mui-col-xs-4 date fm-arial">'+
												datalist[i].day+
											'</div>'+
											'<div class="mui-table-cell mui-col-xs-7 mui-text-right fm-arial money">'+
												'￥'+datalist[i].money+
											'</div>'+
											'<div class="mui-table-cell mui-col-xs-1"></div>'+
										'</div>'+
									'</a>';

					fragment.appendChild(li);
				}
			}
			ul.appendChild(fragment);
			if(container.isNeedRefresh){
				//容器需要刷新才刷 否则就不是上拉加载插件或者设置为不需要刷新
				container.endPullDownToRefresh();
			}
			
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});

};

//创建营业明细列表
var createFragment_detailList = function(container, isAppend) {
	var ul = container.element.querySelector('.mui-table-view')
	if(!isAppend) {
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
				li.innerHTML = '<a href="javascript:;" class="mui-text-center">暂无新的数据</a>';
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
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});

};


//时间选择器
var btnsDatePicker = mui('.datePicker');
btnsDatePicker.each(function(i, btn) {
	btn.addEventListener('tap', function() {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		var ele = this;
		/*
		 * 首次显示时实例化组件
		 * 示例为了简洁，将 options 放在了按钮的 dom 上
		 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
		 */
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			console.log(['当前按钮',ele])
			/*
			 * rs.value 拼合后的 value
			 * rs.text 拼合后的 text
			 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
			 * rs.m 月，用法同年
			 * rs.d 日，用法同年
			 * rs.h 时，用法同年
			 * rs.i 分（minutes 的第二个字母），用法同年
			 */
			ele.querySelector('.selectDate').innerText = rs.text;
			var dateType = ele.getAttribute('data-type');
			var dateCompareflag = false;
			switch (dateType){
				case 'start'://选择的是开始 与结束比对
				var startDate = rs.text.replace('-','');
				var endDate = mui('.endDate')[0].querySelector('.selectDate').innerText.replace('-','');
					dateCompareflag = startDate>endDate;
					break;
				case 'end'://选择的是结束 与开始比对
				var startDate = mui('.startDate')[0].querySelector('.selectDate').innerText.replace('-','');
				var endDate = rs.text.replace('-','');
					dateCompareflag = endDate<startDate;
					break;
				default:
					console.log('data-type 没有找到');
					return false;//阻止关闭选择框
			}
			if(dateCompareflag)
			{
				//为true 既为时间区段错误 不允许关闭选择
				return false;
			}
			
			//开始重置数据
			var container = mui('#statistics-list .mui-scroll');
			createFragment_list(container);
			/* 
			 * 返回 false 可以阻止选择框的关闭
			 * return false;
			 */
			
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

//打开详细列表事件
//mui('#statistics-list .list .mui-table-view-cell').on('tap','.linkDetail',function(){
//	var date = this.getAttribute('data-date');
//	console.log(date);
//})

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