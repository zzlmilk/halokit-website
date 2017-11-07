//创建评论列表
var pageindex_detail = 1,
	totalCount_detail = 0,
	loadflag_detail = true;
var container_comment = mui('#find-detail .mui-scroll');
var createFragment_comment = function(container, isAsync, isAppend) {
	isAsync = isAsync ? true : false;
	var ul = container.element ? container.element.querySelector('.comment-list .mui-table-view.list') : container[0].querySelector('.comment-list .mui-table-view.list');
	if(!isAppend) {
		ul.innerHTML = '';
	}
	var sosid = sessionStorage.sosid;
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
			console.log(['当前评论页数', pageindex_detail]);

			//循环添加数据

			var fragment = document.createDocumentFragment();
			//			if(!data.status || data.data.list.length <= 0) {
			//				var li = document.createElement('li');
			//				li.className = 'mui-table-view-cell';
			//				li.innerHTML = '<a href="javascript:;" class="mui-text-center">暂无新的评论</a>';
			//				fragment.appendChild(li);
			//			} else {
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
				//				console.log(userext);
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell userinfo';
				li.innerHTML = '<img class="headimg mui-media-object mui-pull-left mui-col-xs-2" src="' + JSON.parse(userext.imagepath).IMG[0] + '">' +
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
			//			}
			ul.appendChild(fragment);
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
			var itemsCount = self.element.querySelectorAll('.comment-list .list li').length;
			
			if(totalCount_detail > itemsCount) {
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
//详情元素
var page_detail = mui('#find-detail'),
	ele_header = mui('#detail-head')[0],
	ele_header_title = ele_header.querySelector('.mui-title'),
	ele_slider = mui('#slider'),
	ele_slider_group = ele_slider[0].querySelector('.mui-slider-group'),
	ele_slider_indicator = ele_slider[0].querySelector('.mui-slider-indicator'),
	btn_interest = mui('#btn-interest')[0],
	btn_edit = mui('#btn-edit')[0],
	btn_share = mui('.share')[0],
	//用户信息
	ele_userinfo = page_detail[0].querySelector('.userinfo'),
	ele_userinfo_headimg = ele_userinfo.querySelector('.headimg'),
	ele_userinfo_name = ele_userinfo.querySelector('.name'),
	ele_userinfo_location = ele_userinfo.querySelector('.location'),
	ele_userinfo_time = ele_userinfo.querySelector('.time'),
	//丢失信息
	ele_lostDescribe = ele_userinfo.querySelector('.describe'),
	ele_lostLocation = page_detail[0].querySelector('.lostLocation'),
	ele_lostAddr = page_detail[0].querySelector('.lostAddr'),
	ele_lostTime = page_detail[0].querySelector('.lostTime'),
	//联系方式
	ele_phone = page_detail[0].querySelector('.phone'),
	ele_qq = page_detail[0].querySelector('.qq'),
	ele_wechat = page_detail[0].querySelector('.wechat'),
	//评论
	ele_commentCount = page_detail[0].querySelector('.commentCount'),
	ele_interestCount = page_detail[0].querySelector('.interestCount'),
	input_mui = mui('#comment')[0],
	ele_commentList = page_detail[0].querySelector('.comment-list .mui-table-view.list');
//分享数据
var shareUrl = window.location.protocol + '//' + window.location.host + '/sos/detail',
	sharedata;
//打开详情事件
mui('#find-list,#list').on('tap', '.linkDetail', function() {
	if(isWeiXin()) {
		//微信状态下 隐藏分享按钮
		btn_share.classList.add('mui-hidden');
	}

	//如果没有用户id 就去注册
	if(!sessionStorage.memberid) {
		window.parent.location.href = '/register';
		return;
	}
	//清除详细
	init_detail();
	//隐藏发现标头
	eleListHead.classList.add('mui-hidden');
	//获取id
	var idx = this.getAttribute('data-idx');
	sessionStorage.sosid = idx;
//	console.log(['详细id', idx]);
	//加载详情
	mui.ajax('getDetail', {
		async: false,
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		data: {
			id: idx
		},
		success: function(data) {
//			console.log(['SOS详情', data]);
			//调用失败
			if(!data || data == null || !data.status || data.status != 200) {
				mui.toast('数据获取错误,请关闭页面后重新尝试');
				//				mui.later(function() {
				//					window.location.href = window.location.href;
				//				}, 2000);
				return;
			}
			var rsData = data.data;
			//设置标题
			ele_header_title.innerText = rsData.title;
			//设置关注按钮状态
			if(data.attention == 1) {
				changeBtnInterestCancel();
			} else {
				changeBtnInterest();
			}
			//设置显示按钮
			changeDetailButton(rsData.memberid);
			//成功
			//加载Slider
			var imagesList = rsData.halokitsosimages;
			init_slider(imagesList);
			ele_slider.slider().gotoItem(0); //每次必须重置为第0位置

			//设置用户信息
			ele_userinfo_headimg.src = rsData.imagePath ? JSON.parse(rsData.imagePath).IMG[0] : "http://7xwshy.com1.z0.glb.clouddn.com/7ZBisD2KcPsWDkwT2703.jpeg",
				ele_userinfo_name.innerText = rsData.nickname,
				ele_userinfo_location.innerText = rsData.city,
				ele_userinfo_time.innerText = rsData.createdate.split(' ')[0],
				//丢失信息
				ele_lostDescribe.innerText = rsData.message,
				ele_lostLocation.innerText = rsData.lostplace,
				ele_lostAddr.innerText = rsData.address,
				ele_lostTime.innerText = rsData.lostdate.split(' ')[0],
				//联系方式
				ele_phone.innerText = rsData.phone,
				ele_qq.innerText = rsData.qq ? rsData.qq : '无',
				ele_wechat.innerText = rsData.wechat ? rsData.wechat : '无',
				//评论数
				ele_commentCount.innerText = data.totalcomment,
				//关注数
				ele_interestCount.innerText = data.totalattention;
			
			//分享数据
			sharedata = {
				url: shareUrl,
				//			title: ele_header_title.innerText,
				title: ele_userinfo_name.innerText,
				//			describe: ele_lostDescribe.innerText.substring(0, 29) + '...',
				describe: ele_header_title.innerText.substring(0, 29) + '...',
				imgurl: ele_userinfo_headimg.src,
				params: 'id=' + sessionStorage.sosid + '&memberid=' + sessionStorage.memberid
			};
			sessionStorage.sharedata = JSON.stringify(sharedata);
			//设置分享当前页面
			window.parent.share();
//			console.log(['详细分享数据', sharedata]);
			//加载评论
			createFragment_comment(container_comment, false, true);
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
			mui.later(function() {
				window.location.href = window.location.href;
			}, 2000);
		}
	});

});

//关闭详细事件
mui('#detail-head').on('tap', '.mui-action-back', function() {
	//隐藏发现标头
	eleListHead.classList.remove('mui-hidden');
	//重置详细窗口位置
	mui('#find-detail .mui-scroll-wrapper').scroll().scrollTo(0, 0, 0);
	//重置控件中保存的值
	input_mui.value = '';
	//删除sosid session
	console.log(['清除sessionStorage.sosid', sessionStorage.sosid]);
	delete sessionStorage.sosid;
	//删除sharedata
	console.log(['清除sessionStorage.sharedata', sessionStorage.sharedata]);
	delete sessionStorage.sharedata;
	//取消分享当前页面
	window.parent.share();
	//重置参数
	pageindex_detail = 1;
	totalCount_detail = 0;
	loadflag_detail = true;
	//清除评论
	ele_commentList.innerHTML = '';
});
//分享
mui('#detail-head').on('tap', '.share', function() {
//	console.log(['分享数据', sharedata]);
	//调用app
	if(type === 'ios') {
		//		alert("objc://toPay?" + JSON.stringify(sharedata));
		window.location.href = "objc://toPay?" + sessionStorage.sharedata;
	} else if(type === 'android') {
		//		alert('android.toPay ' + JSON.stringify(sharedata));
		android.toPay(sessionStorage.sharedata);
	} else {
		mui.toast('敬请期待');
	}

});
//关注
mui('#find-detail').on('tap', '#btn-interest', function() {
	var btn = this;
	var idx = sessionStorage.sosid;
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
//编辑
mui('#find-detail').on('tap', '#btn-edit', function() {
	var idx = sessionStorage.sosid;
//	console.log(['编辑id', idx]);
	window.location.href = 'edit?id=' + idx;
});
//评论
mui('#find-detail').on('tap', '#subComment', function() {
	var id = sessionStorage.sosid;
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
			id: id,
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

//初始化详细
function init_detail() {
	ele_slider_group.innerHTML = '';
	ele_slider_indicator.innerHTML = '';
}
//加载图片
function init_slider(imagesList) {
	var imgfragment = document.createDocumentFragment();
	var indicatorfragment = document.createDocumentFragment();
	for(var i = 0; i < imagesList.length; i++) {
		var div_group = document.createElement('div');
		div_group.classList.add('mui-slider-item');
		var img = new Image();
		img.src = JSON.parse(imagesList[i].imageurl).IMG[0]
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
		div_group.appendChild(img);
		imgfragment.appendChild(div_group);
		var div_indicator = document.createElement('div');
		div_indicator.classList.add('mui-indicator');
		if(i == 0) {
			div_indicator.classList.add('mui-active');
		}
		indicatorfragment.appendChild(div_indicator);
	}
	//	console.log(imgfragment);
	ele_slider_group.appendChild(imgfragment);
	ele_slider_indicator.appendChild(indicatorfragment);
}
//切换详情中的按钮
function changeDetailButton(memberid) {
	if(memberid == sessionStorage.memberid) {
		//如果是当前用户
		if(!btn_interest.classList.contains('mui-hidden')) {
			btn_interest.classList.add('mui-hidden');
		}
		if(btn_edit.classList.contains('mui-hidden')) {
			btn_edit.classList.remove('mui-hidden');
		}
	} else {
		if(btn_interest.classList.contains('mui-hidden')) {
			btn_interest.classList.remove('mui-hidden');
		}
		if(!btn_edit.classList.contains('mui-hidden')) {
			btn_edit.classList.add('mui-hidden');
		}
	}
}
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

function isWeiXin() {
	return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
}