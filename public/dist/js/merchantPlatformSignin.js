mui.init();
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});

//元素
var container = mui('#tabbar-signin .mui-scroll');

container.pullToRefresh({
	down: {
		callback: function() {
			var self = this;
			createFragment(self)
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
var createFragment = function(container, isAppend) {
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
//	var elebg = this.childNodes[1];
//	console.log(['bg元素', this.childNodes[1]]);
//	alert(this.innerText);
	//获取列表所有的id
	var list = mui('#tabbar-signin .list .mui-table-view .mui-table-view-cell .btn-Signin');
	if(!list||list.length<=0){
		mui.toast('没有签到记录');
		return;
	}
	var idxArr = [];
	for (var i =0;i<list.length;i++) {
		idxArr[i]=list[i].getAttribute('idx');
	}
	mui.ajax('allSigninConfirm', {
		async: true,
		data: {
			id: idxArr.join(',')
		},
		dataType: 'json', //服务器返回json格式数据
		success: function(data) {
			console.log(data);
			if(!data.status) {
				mui.toast('操作失败，请关闭页面后重新尝试');
				return;
			}
			mui.toast('操作成功');
			setTimeout(function(){
				window.location = window.location;
			},2000);
			mui('#tabbar-signin .dashboard .right .number')[0].innerText = ele.parentNode.querySelectorAll('li').length;
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});
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
