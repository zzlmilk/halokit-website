//静止普通的滚动
document.body.addEventListener('touchmove', function(event) {
	event.preventDefault();
}, false);

//删除sharedata
console.log(['清除sessionStorage.sharedata', sessionStorage.sharedata]);
delete sessionStorage.sharedata;
//取消分享当前页面
window.parent.share();

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
	defaultPage: '#find-list'
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
var pageindex = 1,
	totalCount = 0,
	loadflag = true,
	container = mui('#find-list .mui-scroll');
container.pullToRefresh({
	//	down: {
	//		callback: function() {
	//			var self = this;
	//			createFragment(self, true);
	//		}
	//	},
	up: {
		contentrefresh: "正在加载...",
		callback: function() {
			var self = this;
			var itemsCount = self.element.querySelectorAll('li').length;
			if(totalCount > itemsCount) {
				if(loadflag) {
					loadflag = false;
					pageindex++;
					setTimeout(function() {
						createFragment(self, true, true);
					}, 1000);
				}
				self.endPullUpToRefresh(false);
			} else {
				self.endPullUpToRefresh(true);
			}
		}
	}
});

//图片的懒加载
var lazyLoad_parms = {
		placeholder: '/img/loading_1.png',
		destroy: false,
	},
	lazyLoad = container.imageLazyload(lazyLoad_parms);
//创建sos列表
var createFragment = function(container, isAsync, isAppend) {
	isAsync = isAsync ? true : false;
	var ul_BoxLeft = container.element ? container.element.querySelector('.BoxLeft') : container[0].querySelector('.BoxLeft'),
		ul_BoxRight = container.element ? container.element.querySelector('.BoxRight') : container[0].querySelector('.BoxRight');
	if(!isAppend) {
		ul_BoxLeft.innerHTML = '';
		ul_BoxRight.innerHTML = '';
	}
	console.log(['当前页数', pageindex]);
	mui.ajax('getList', {
		async: isAsync,
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		data: {
			pageindex: pageindex
		},
		success: function(data) {
			//			console.log(['SOS列表', data]);
			if(totalCount <= 0) {
				totalCount = data.total;
			}

			//循环添加数据
			for(var i = 0; i < data.list.length; i++) {
				//				console.log('宠物信息',data.list[i].halokitpet);
				var li = document.createElement('li'),
					areaName = data.list[i].lostplace.split(' ');
				li.innerHTML = '<a class="linkDetail" href="#find-detail" data-idx="' + data.list[i].id + '">' +
					'<div class="mui-card">' +
					'<div class="head-img mui-card-media">' +
					'<img data-lazyload="' + JSON.parse(data.list[i].halokitsosimages[0].imageurl).IMG[0] + '?v=' + Math.floor(Math.random() * 1000) + '" />' +
					'</div>' +
					'<div class="mui-card-content">' +
					'<div class="mui-card-content-inner">' +
					'<p class="describes mui-ellipsis-2 fc-default">' + data.list[i].title + '</p>' +
					'<div>' +
					'<span class="time mui-pull-left fc-light">' + data.list[i].createdate.toString().split(' ')[0] + '</span>' +
					'<div class="mui-clearfix"></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div class="userinfo mui-card-header mui-card-media">' +
					'<img data-lazyload="' + (data.list[i].halokitpet && data.list[i].halokitpet.imagepath ? JSON.parse(data.list[i].halokitpet.imagepath).IMG[0] : 'http://7xwshy.com1.z0.glb.clouddn.com/7ZBisD2KcPsWDkwT2703.jpeg') + '?v=' + Math.floor(Math.random() * 1000) + '">' +
					'<div class="mui-media-body">' +
					'<p>' + (data.list[i].halokitpet ? data.list[i].halokitpet.nickname : '未命名') + '</p>' +
					'<p>' + areaName[areaName.length - 1] + '</p>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</a>';

				if(ul_BoxLeft.offsetHeight <= ul_BoxRight.offsetHeight) {
					//增加图片事件使其可以渐渐显示
					ul_BoxLeft.appendChild(li);
				} else {
					ul_BoxRight.appendChild(li);
				}
				lazyLoad.refresh(true);
			}

			if(container.isNeedRefresh) {
				//容器需要刷新才刷 否则就不是上拉加载插件或者设置为不需要刷新
				container.endPullDownToRefresh();
			}
			loadflag = true;
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});

};

//初始加载
createFragment(container, true);
//跳转到定位页面
mui(document).on('tap', '.locationBar', function() {
	window.parent.location.href = 'location';
});
//标头元素
var eleListHead = mui('#list-head')[0];