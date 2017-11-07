//删除sharedata
console.log(['清除sessionStorage.sharedata', sessionStorage.sharedata]);
delete sessionStorage.sharedata;

mui.init();
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});
//评论
var input_mui = mui('#comment')[0],
	btn_interest = mui('#btn-interest')[0],
	ele_interestCount = mui('.interestCount')[0];

//创建评论列表
var pageindex_detail = 1,
	totalCount_detail = 0,
	loadflag_detail = true,
	container_comment = mui('#find .mui-scroll'),
	ele_commentCount = container_comment[0].querySelector('.commentCount');
	
//图片的懒加载
var lazyLoad_parms = {
		placeholder: '/img/loading_1.png',
		destroy: false,
	},
	lazyLoad = mui(document).imageLazyload(lazyLoad_parms),
	lazyLoad_comment = container_comment.imageLazyload(lazyLoad_parms);

//页面先懒加载
lazyLoad_comment.refresh(true);

var createFragment_comment = function(container, isAsync, isAppend) {
	isAsync = isAsync ? true : false;
	var ul = container.element ? container.element.querySelector('.mui-table-view.list') : container[0].querySelector('.mui-table-view.list');
	if(!isAppend) {
		ul.innerHTML = '';
	}
	mui.ajax('getCommentList', {
		async: isAsync,
		dataType: 'json', //服务器返回json格式数据
		data: {
			id: sosid,
			pageindex: pageindex_detail
		},
		success: function(data) {
			//			console.log(['评论列表', data]);
			if(totalCount_detail <= 0) {
				totalCount_detail = data.data.total;
				ele_commentCount.innerText = totalCount_detail;
			}
			//			console.log(['当前评论页数', pageindex_detail]);

			//循环添加数据
			var fragment = document.createDocumentFragment();
			var datalist = data.data.list;
			for(var i = 0; i < datalist.length; i++) {
				var userext;
				if(datalist[i].member) {
					userext = datalist[i].member.halokitmemberext[0];
					if(!userext.nickname || userext.nickname == '') {
						userext.nickname = '匿名用户';
					}
					if(!userext.imagepath) {
						userext.imagepath = '{"IMG":["http://7xwshy.com1.z0.glb.clouddn.com/7ZBisD2KcPsWDkwT2703.jpeg"]}';
					}
				} else {
					userext = {
						nickname: '匿名用户',
						imagepath: '{"IMG":["http://7xwshy.com1.z0.glb.clouddn.com/7ZBisD2KcPsWDkwT2703.jpeg"]}'
					};
				}

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell userinfo';
				li.innerHTML = '<img class="headimg mui-media-object mui-pull-left mui-col-xs-2" data-lazyload="' + JSON.parse(userext.imagepath).IMG[0] + '?v=' + Math.floor(Math.random() * 1000) + '">' +
					'<div class="mui-media-body">' +
					'<p>' +
					'<span class="name fc-dark fs15">' + userext.nickname + '</span>' +
					'</p>' +
					'<p class="fs13">' +
					'<span class="time fc-light fm-arial">' + datalist[i].createtime + '</span>' +
					'</p>' +
					'<p class="describe mui-media-body fc-dark">' +
					datalist[i].comment +
					'</p>' +
					'</div>';

				fragment.appendChild(li);
			}
			ul.appendChild(fragment);
			lazyLoad_comment.refresh(true);
			if(container.isNeedRefresh) {
				//容器需要刷新才刷 否则就不是上拉加载插件或者设置为不需要刷新
				container.endPullDownToRefresh();
			}
			loadflag_detail = true;
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});
};

//评论刷新
container_comment.pullToRefresh({
	//	down: {
	//		callback: function() {
	//			var self = this;
	//			createFragment_comment(self, true);
	//		}
	//	},
	up: {
		contentrefresh : "正在加载...",
		callback: function() {
			var self = this;
			var itemsCount = self.element.querySelectorAll('.list li').length;
			if(totalCount_detail >= itemsCount) {
				if(loadflag_detail) {
					loadflag_detail = false;
					pageindex_detail++;
					setTimeout(function() {
						createFragment_comment(self, true, true);
					}, 1000);
				}
				self.endPullUpToRefresh(false);
			} else {
				self.endPullUpToRefresh(true);
			}

		}
	}
});
createFragment_comment(container_comment, false, true);
//初始化
init();
mui('#find-detail').on('tap', '#subComment', function() {
	var msg = input_mui.value;
	if(msg.replace(/ /g, '') == '') {
		mui.toast('好好的输入线索哦~');
		return;
	}
	mui.ajax('comment.do', {
		async: false,
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		data: {
			id: sosid,
			msg: msg
		},
		success: function(data) {
			//			console.log(['评论返回', data]);
			if(!data.status) {
				mui.toast('操作失败，请稍后重试');
				return;
			}
			//成功刷新
			//重置参数
			pageindex_detail = 1;
			totalCount_detail = 0;
			loadflag_detail = true;
			createFragment_comment(container_comment, true);
			mui.toast('评论成功~')
			input_mui.value = '';
			//			console.log(this);
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请稍后重试');
		}
	});
});
mui('#find-detail').on('tap', '#btn-interest', function() {
	if(needguanzhu) {
		gotoguanzhu();
		return;
	}
	var btn = this;
	var idx = sosid;
	type = btn.getAttribute('data-type');
	btn.classList.add('mui-disabled');
	//转为关注按钮
	//	console.log(['关注类型',type]);
	switch(type) {
		case 'do': //关注
			//			console.log(['关注id', idx]);
			Interest_do(idx);
			break;
		case 'cancel': //取消关注
			//			console.log(['取消关注id', idx]);
			Interest_cancel(idx);
			break;
		default:
			mui.toast('操作失败，请关闭页面后重新尝试');
			break;
	}
});
mui('#header').on('tap', '.back', function() {
	//	if(needguanzhu) {
	//		gotoguanzhu();
	//		return;
	//	}
	window.location.href = "/sos/#find"
});
mui('#header').on('tap', '.publish', function() {
	if(needguanzhu) {
		gotoguanzhu();
		return;
	}
	window.location.href = "/sos/#publish"
});
//			mui('#header').on('tap', '.back', function() {
//				window.location.href = '/sos/';
//			});

mui.ready(function() {
	var ele_slider = mui('#slider'),
		ele_slider_indicator = ele_slider[0].querySelector('.mui-slider-indicator').querySelectorAll('.mui-indicator');

	//初始到第一张
	ele_slider.slider().gotoItem(0);
	ele_slider_indicator[0].classList.add('mui-active');

	init_slider();

	function init_slider() {
		var imgArr = ele_slider[0].querySelectorAll('.mui-slider-item img');
		for(var i = 0; i < imgArr.length; i++) {
			var img = imgArr[i];
			img.src = img.getAttribute('data-src');
			img.onload = function() {
				var expectWidth = this.naturalWidth;
				var expectHeight = this.naturalHeight;
				var styleStr = '';
				if(expectHeight >= expectWidth) {
					//高大于宽
					this.style['height'] = '100%';
				} else {
					//宽大于高
					this.style['width'] = '100%',
						this.style['margin-top'] = (ele_slider[0].offsetHeight - this.offsetHeight) / 2 + 'px';
				}
			}

		}
	}
});
//微信分享操作

var petname = mui('#petname')[0].innerText,
	pagetitle = mui('#pagetitle')[0].innerText,
	sharelink = window.location.href,
	shareimg = mui('#petheadimg')[0].src;
mui.ajax('/wechat/getsignature', {
	async: true,
	type: 'post',
	dataType: 'json', //服务器返回json格式数据
	data: {
		url: location.href.split('#')[0] // 将当前URL地址上传至服务器用于产生数字签名
	},
	success: function(data) {
		//		console.log(data);
		// 开始配置微信JS-SDK
		wx.config(data);
		// 调用微信API
		wx.ready(function() {
			var sdata = {
				title: '【可点SOS】请大家帮帮我家' + petname,
				desc: pagetitle + '...',
				link: sharelink,
				imgUrl: shareimg,
				success: function() {
					//								console.log('用户确认分享后执行的回调函数');
				},
				cancel: function() {
					//								console.log('用户取消分享后执行的回调函数');
				}
			};
			wx.onMenuShareTimeline(sdata); //分享到朋友圈
			wx.onMenuShareAppMessage(sdata); //分享给朋友
			wx.onMenuShareQQ(sdata); //分享到QQ
			wx.onMenuShareWeibo(sdata); //分享到腾讯微博
			wx.onMenuShareQZone(sdata); //分享到QQ空间
		});
	},
	error: function(xhr, type, errorThrown) {
		console.log('微信签名失败', errorThrown);
	}
});

//切换为关注
function changeBtnInterest() {
	btn_interest.setAttribute('data-type', 'do');
	btn_interest.className = 'mui-pull-right fc-light';
	btn_interest.innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i> 关注';
}
//切换为取消关注
function changeBtnInterestCancel() {
	btn_interest.setAttribute('data-type', 'cancel');
	btn_interest.className = 'mui-pull-right fc-pink';
	btn_interest.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i> 已关注';
}
//关注
function Interest_do(id) {
	mui.ajax('interest.do', {
		async: true,
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		data: {
			id: id
		},
		success: function(data) {
			//			console.log(['关注返回', data]);
			if(!data.status) {
				mui.toast('操作失败，请稍后重试');
				return;
			}
			changeBtnInterestCancel();
			ele_interestCount.innerText = parseInt(ele_interestCount.innerText) + 1;
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请稍后重试');
		}
	});
}
//取消关注
function Interest_cancel(id) {
	mui.ajax('interest.cancel', {
		async: true,
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		data: {
			id: id
		},
		success: function(data) {
			//			console.log(['取消关注返回', data]);
			if(!data.status) {
				mui.toast('操作失败，请稍后重试');
				return;
			}
			changeBtnInterest();
			ele_interestCount.innerText = parseInt(ele_interestCount.innerText) - 1;
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请稍后重试');
		}
	});
}

//跳转道下载
function gotodownload() {
	window.location.href = '/downloads';
}
//跳转到关注
function gotoguanzhu() {
	//预备链接
	//	window.location.href = 'https://mp.weixin.qq.com/s/M5_EsANtwuz9qMcfpDEsCg';
	//上线链接
	window.location.href = 'https://mp.weixin.qq.com/s/I5jL4nHjpfjdL03-fBNFww';
}

//初始化
function init() {
	//设置关注按钮状态
	if(attention == 1) {
		changeBtnInterestCancel();
	} else {
		changeBtnInterest();
	}
}