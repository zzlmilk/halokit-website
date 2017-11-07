//静止普通的滚动
document.body.addEventListener('touchmove', function(event) {
	event.preventDefault();
}, false);

//删除sharedata
console.log(['清除sessionStorage.sharedata', sessionStorage.sharedata]);
delete sessionStorage.sharedata;
//取消分享当前页面
window.parent.share();

//如果没有用户id 就去注册
if(!sessionStorage.memberid) {
	window.parent.location.href = '/register';
}
mui.init();
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});

//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#list'
	//	defaultPage: '#find-detail'
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
var container = mui('#list .mui-scroll');
container.pullToRefresh({
	down: {
		callback: function() {
			var self = this;
			createFragment(self, true);
		}
	},
	//	up: {
	//		callback: function() {
	//			var self = this;
	//			var itemsCount = self.element.querySelectorAll('li').length;
	//			if(totalCount > itemsCount) {
	//				if(loadflag) {
	//					loadflag = false;
	//					pageindex++;
	//					setTimeout(function() {
	//						createFragment(self, true, true);
	//					}, 1000);
	//				}
	//				self.endPullUpToRefresh(false);
	//			} else {
	//				self.endPullUpToRefresh(true);
	//			}
	//		}
	//	}
});
//图片的懒加载
var lazyLoad_parms = {
		placeholder: '/img/loading_1.png',
		destroy: false,
	},
	lazyLoad = container.imageLazyload(lazyLoad_parms);
//创建关注列表
var createFragment = function(container, isAsync, isAppend) {
	isAsync = isAsync ? true : false;
	var box = container.element ? container.element : container[0];
	if(!isAppend) {
		box.innerHTML = '';
	}
	mui.ajax('getMyInterest', {
		async: isAsync,
		dataType: 'json', //服务器返回json格式数据
		success: function(data) {
//			console.log(['关注列表', data]);
			//循环添加数据
			var fragment = document.createDocumentFragment();
			var datalist = data.data;
			if(datalist.length <= 0) {
				var tips = document.createElement('div');
				tips.className = 'mui-pull-bottom-tips';
				tips.innerHTML = '<div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading">没有更多数据了</span></div>';
				fragment.appendChild(tips);
			} else {
				for(var i = 0; i < datalist.length; i++) {
					var div = document.createElement('div');
					var locationArr = datalist[i].lostplace.split(' ');
					var locationStr;
					if(locationArr.length > 1) {
						locationStr = locationArr[locationArr.length - 2] + locationArr[locationArr.length - 1];
					} else {
						locationStr = locationArr.join('');
					}
					div.className = 'mui-card';
					div.innerHTML = '<div class="mui-card-content mui-row">' +
						'<div class="mui-col-xs-3">' +
						'<img class="headimg" data-lazyload="' + (datalist[i].halokitpet && datalist[i].halokitpet.imagepath ? JSON.parse(datalist[i].halokitpet.imagepath).IMG[0] : 'http://7xwshy.com1.z0.glb.clouddn.com/7ZBisD2KcPsWDkwT2703.jpeg') + '?v=' + Math.floor(Math.random() * 1000) + '" />' +
						'</div>' +
						'<div class="mui-col-xs-9">' +
						'<p>' +
						'<span class="name fc-dark fs15">' + (datalist[i].halokitpet ? datalist[i].halokitpet.nickname : '未命名') + '</span>' +
						'<button data-idx="' + datalist[i].id + '" data-type="cancel" class="mui-pull-right mui-btn mui-btn-link fc-pink pdr10"><i class="fa fa-heart" aria-hidden="true"></i> 已关注</button>' +
						'</p>' +
						'<a class="linkDetail" href="#find-detail" data-idx="' + datalist[i].id + '">' +
						'<p class="mui-ellipsis pdr10">' +
						datalist[i].title +
						'</p>' +
						'<p class="fs13">' +
						'<span class="location fc-light">' + locationStr + '</span>' +
						'<span class="time fc-light fm-arial mui-pull-right pdr10">' + datalist[i].createdate.split(' ')[0] + '</span>' +
						'</p>' +
						'</a>' +
						'</div>' +
						'</div>';
					//增加事件
					div.querySelector('button').addEventListener('tap', interest);

					fragment.appendChild(div);
				}
			}
			box.appendChild(fragment);
			lazyLoad.refresh(true);
			if(container.isNeedRefresh) {
				//容器需要刷新才刷 否则就不是上拉加载插件或者设置为不需要刷新
				container.endPullDownToRefresh();
			}
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});

};

//初始加载
createFragment(container, true);
//标头元素
var eleListHead = mui('#head')[0];
//取消关注事件
function interest() {
	var ele = event.target;
	var type = ele.getAttribute('data-type');
	switch(type) {
		case 'do': //关注
			todo(ele);
			break;
		case 'cancel': //取消关注
			cancel(ele);
			break;
		default:
			mui.toast('操作失败，请关闭页面后重新尝试');
			break;
	}

}
//关注
function todo(ele) {
	var idx = ele.getAttribute('data-idx');
//	console.log(['关注', idx]);
	mui.ajax('interest.do', {
		async: true,
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		data: {
			id: idx
		},
		success: function(data) {
//			console.log(['关注返回', data]);
			if(!data.status) {
				mui.toast('操作失败，请稍后重试');
				return;
			}
			ele.setAttribute('data-type', 'cancel');
			ele.className = 'do mui-pull-right mui-btn mui-btn-link fc-pink pdr10';
			ele.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i> 已关注</button>';
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请稍后重试');
		}
	});
}
//取消关注
function cancel(ele) {
	var idx = ele.getAttribute('data-idx');
//	console.log(['取消关注', idx]);
	mui.ajax('interest.cancel', {
		async: true,
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		data: {
			id: idx
		},
		success: function(data) {
//			console.log(['取消关注返回', data]);
			if(!data.status) {
				mui.toast('操作失败，请稍后重试');
				return;
			}
			ele.setAttribute('data-type', 'do');
			ele.className = 'do mui-pull-right mui-btn mui-btn-link fc-light pdr10';
			ele.innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i> 关注</button>';
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请稍后重试');
		}
	});
}