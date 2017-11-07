function share() {
	if(!isWeiXin()) {
		return;
	}
	//微信分享操作
	var shareData = sessionStorage.sharedata;
	if(shareData) {
		shareData = JSON.parse(shareData);
		shareData = {
			title: '【可点SOS】请大家帮帮我家' + shareData.title,
			desc: shareData.describe,
			link: shareData.url + '?' + shareData.params,
			imgUrl: shareData.imgurl,
			success: function() {
				//								console.log('用户确认分享后执行的回调函数');
			},
			cancel: function() {
				//								console.log('用户取消分享后执行的回调函数');
			}
		}
	} else {
		shareData = {
			title: '啥？你家爱宠丢了？',
			desc: '别急，戳进来看看→→',
			link: "https://mp.weixin.qq.com/s/M5_EsANtwuz9qMcfpDEsCg",
			imgUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/28FlbgTia7mdLBLfIicIn3FcqYucVibwGeFgMjoujjlicULsVNFkp7u0LseUrYhgDBbDnEDHDk6yFxKkI5R1anQ2Fg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1',
			success: function() {
				//								console.log('用户确认分享后执行的回调函数');
			},
			cancel: function() {
				//								console.log('用户取消分享后执行的回调函数');
			}
		}
	}

	mui.ajax('/wechat/getsignature', {
		async: true,
		type: 'post',
		dataType: 'json', //服务器返回json格式数据
		data: {
			url: location.href.split('#')[0] // 将当前URL地址上传至服务器用于产生数字签名
		},
		success: function(data) {
//			console.log(data);
			// 开始配置微信JS-SDK
			wx.config(data);
			wx.ready(function() {
				// 调用微信API
				wx.onMenuShareTimeline(shareData); //分享到朋友圈
				wx.onMenuShareAppMessage(shareData); //分享给朋友
				wx.onMenuShareQQ(shareData); //分享到QQ
				wx.onMenuShareWeibo(shareData); //分享到腾讯微博
				wx.onMenuShareQZone(shareData); //分享到QQ空间
			});
		},
		error: function(xhr, type, errorThrown) {
			console.log('微信签名失败', errorThrown);
		}
	});

}

function isWeiXin() {
	return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
}