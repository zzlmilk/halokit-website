//删除sharedata
console.log(['清除sessionStorage.sharedata', sessionStorage.sharedata]);
delete sessionStorage.sharedata;

//取消分享当前页面
share();

//如果用户不存在就去注册
if(!sessionStorage.memberid) {
	window.parent.location.href = '/register';
}

//隐藏返回提示
if(sessionStorage.needShowBackInfo){
	mui('.mui-action-back .alertinfo')[0].innerText = 'SOS中心';
}

mui.init();
//重构back
mui.back = function() {
	window.location.href = document.referrer === '' ? '/sos/#find' : document.referrer;
}
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});
//不允许textarea换行 只允许详情 id = describe
mui(document.body).on('keydown', 'textarea', function(e) {
	if(e.keyCode != 13 || this.id === 'describe') return;
	e.preventDefault();
});

//获取地址数据
mui.getJSON('getlocation', function(data) {
	//地区选择器
	var cityPicker = new mui.PopPicker({
		layer: 3
	});
	//console.log(JSON.stringify(data));
	cityPicker.setData(data);
	mui('#lostLocation')[0].addEventListener('tap', function(event) {
		inputblur();
		var ele = this;
		cityPicker.show(function(items) {
			ele.innerHTML = items[0].text + " " + items[1].text + " " + items[2].text;
//			console.log(['你选择的城市是', event.target.innerText]);
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	}, false);
});

//时间选择器
var btnsDatePicker = mui('#lostTime');
btnsDatePicker.each(function(i, btn) {
	btn.addEventListener('tap', function() {
		inputblur();
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		if(options.endDate && options.endDate.replace(/ /g, '') != '') {
			options.endDate = new Date(options.endDate);
		}
		var id = this.getAttribute('id');
		var ele = this;
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
//			console.log(['选择的时间', rs.text]);
			ele.innerHTML = rs.text;
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

var imgContainer = mui('#image-list');

var input_title = mui('#title')[0]
//var input_petNickname = mui('#petNickname')[0];
var input_lostTime = mui('#lostTime')[0];
var input_lostLocation = mui('#lostLocation')[0];
var input_lostAddr = mui('#lostAddr')[0];
var input_phone = mui('#phone')[0];
var input_wechat = mui('#wechat')[0];
var input_qq = mui('#qq')[0];
var input_describe = mui('#describe')[0];

mui(document.body).on('click', 'textarea', function(e) {
	e.target.focus();
})
mui(document.body).on('tap', '#btnSubit', function(e) {
	inputblur();
	try {
		var title = input_title.value,
			//petNickname = input_petNickname.value,
			lostTime = input_lostTime.innerText,
			lostLocation = input_lostLocation.innerText,
			lostAddr = input_lostAddr.value,
			phone = input_phone.value,
			wechat = input_wechat.value,
			qq = input_qq.value,
			describe = input_describe.value;
//		console.log(lostLocation);
//		console.log(lostTime);
		//标题
		if(title.replace(/ /g, '') == '') {
			mui.toast('请输入标题');
			return;
		}
		if(title.length > 30) {
			mui.toast('标题输入过长');
			return;
		}
		//宠物昵称
		//	if(petNickname.replace(/ /g, '') == '') {
		//		mui.toast('请输入宠物昵称');
		//		return;
		//	}
		//	if(petNickname.length>50) {
		//		mui.toast('宠物昵称输入过长');
		//		return;
		//	}
		//丢失时间
		if(lostTime.replace(/请选择丢失时间/g, '') == '') {
			mui.toast('请选择丢失时间');
			return;
		}
		//丢失地区
		if(lostLocation.replace(/请选择丢失地区/g, '') == '') {
			mui.toast('请选择丢失地区');
			return;
		}
		//详细地址
		if(lostAddr.replace(/ /g, '') == '') {
			mui.toast('请输入详细地址');
			return;
		}
		if(lostAddr.length > 100) {
			mui.toast('详细地址输入过长');
			return;
		}
		//手机号码
		if(isNaN(phone) || !/^1(3|4|5|7|8)[0-9]\d{8}$/.test(phone)) {
			mui.toast('请输入正确的手机号码');
			return;
		}
		//QQ
		if(qq.replace(/ /g, '') != '') {
			if(isNaN(qq)) {
				mui.toast('请输入正确的qq号码');
				return;
			}
		}
		//描述
		if(describe.replace(/ /g, '') == '') {
			mui.toast('请输入描述');
			return;
		}
		if(describe.length > 200) {
			mui.toast('描述输入过长');
			return;
		}

		//图片
		var images = imgContainer[0].querySelectorAll('.hasimage');
		if(images.length <= 0) {
			mui.toast('至少选择1张图片');
			return;
		}
		var imagesStrList = [];
		for(var i = 0; i < images.length; i++) {
			imagesStrList.push(images[i].getAttribute('data-imgpath'));
		}
		var btn = mui(this);
		btn.button('loading');
		//绑定
		mui.getJSON('publish.do', {
			title: title,
			//		petNickname:petNickname,
			lostTime: lostTime,
			lostLocation: lostLocation,
			lostAddr: lostAddr,
			phone: phone,
			wechat: wechat,
			qq: qq,
			describe: describe,
			imagesPath: imagesStrList.join(',')
		}, function(data) {
//			console.log('发布返回',data);
			btn.button('reset');
			if(data.status) {
				btn[0].classList.add("mui-disabled");
				mui.toast('提交成功，请耐心等待审核');
				setTimeout(function() {
					window.location.href = "/sos/#published";
					//					window.location.hash = 'published';
					//					window.location.reload();
				}, 2000)
			} else {
				mui.toast('操作失败，请稍后重试');
			}
		});
	} catch(e) {
		//TODO 错误提醒
		mui.toast('发生错误，请关闭页面后重新操作')
		return;
	}
});

imgContainer.on('tap', '.image-up', function() {
	if(getFileImageCount() >= 8) {
		mui.toast('最大只能选择7张图片哦，请在删除后重新操作');
		return;
	}
	mui('#uploadImage')[0].click();
});

//图片上传
function getFileImageCount() {
	return imgContainer[0].querySelectorAll('.image-item').length;
}
//清晰度
var quality = 0.2,
	maxWidth = 400,
	maxHeight = 600;

function selectFileImage(fileObj) {
	//创建容器 开始loading
	var imageItem = document.createElement("div");
	imageItem.classList.add('image-item', 'hasimage');
	imgContainer[0].appendChild(imageItem);
	var imagefile = document.createElement("div");
	imagefile.classList.add('file');
	imageItem.appendChild(imagefile);
	var imageLoading = document.createElement("div");
	imageLoading.classList.add('loading', 'fa', 'fa-spinner', 'fa-spin', 'fa-3x', 'fa-fw');
	imagefile.appendChild(imageLoading);

	var file = fileObj.files['0'];
	//图片方向角 added by lzk
	var Orientation = null;
	//	console.log(file);
	if(file) {
		var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
		if(!rFilter.test(file.type)) {
			mui.toast('请选择jpeg、png格式的图片');
			return;
		}
		//获取照片方向角属性，用户旋转控制
		EXIF.getData(file, function() {
			EXIF.getAllTags(this);
			Orientation = EXIF.getTag(this, 'Orientation');
		});

		var oReader = new FileReader();
		oReader.onload = function(e) {
			var image = new Image();
			image.src = e.target.result;
			image.onload = function() {
				var expectWidth = this.naturalWidth;
				var expectHeight = this.naturalHeight;
//				console.log(['图片原始大小', expectWidth + ',' + expectHeight]);
				if(this.naturalWidth > this.naturalHeight && this.naturalWidth > maxWidth) {
					expectWidth = maxWidth;
					expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
				} else if(this.naturalHeight > this.naturalWidth && this.naturalHeight > maxHeight) {
					expectHeight = maxHeight;
					expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
				}
//				console.log(['图片压缩大小', expectWidth + ',' + expectHeight]);
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = expectWidth;
				canvas.height = expectHeight;
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, expectWidth, expectHeight);
				ctx.drawImage(this, 0, 0, expectWidth, expectHeight);

				var drawImg = new Image();
				drawImg.src = canvas.toDataURL("image/jpeg");
//				console.log(['canvas绘制大小', canvas.width + ',' + canvas.height]);
				var base64 = null;
				//				var mpImg = new MegaPixImage(drawImg);
				//				mpImg.render(canvas, {
				//					maxWidth: maxWidth,
				//					maxHeight: maxHeight,
				//					quality: quality,
				//					orientation: Orientation
				//				});
				//
				//				base64 = canvas.toDataURL("image/jpeg");

				//修复ios
				if(navigator.userAgent.match(/iphone/i)) {
//					console.log('iphone');
					//如果方向角不为1，都需要进行旋转 
					if(Orientation != "" && Orientation != 1) {
						console.log('旋转处理');
						switch(Orientation) {
							case 6: //需要顺时针（向左）90度旋转
//								console.log('需要顺时针（向左）90度旋转');
								rotateImg(this, 'left', canvas);
								break;
							case 8: //需要逆时针（向右）90度旋转
//								console.log('需要顺时针（向右）90度旋转');
								rotateImg(this, 'right', canvas);
								break;
							case 3: //需要180度旋转
//								console.log('需要180度旋转');
								rotateImg(this, 'right', canvas); //转两次
								rotateImg(this, 'right', canvas);
								break;
						}
					}
					var mpImg = new MegaPixImage(drawImg);
					mpImg.render(canvas, {
						maxWidth: maxWidth,
						maxHeight: maxHeight,
						quality: quality,
						orientation: Orientation
					})
					base64 = canvas.toDataURL("image/jpeg");

				}
				//				else if(navigator.userAgent.match(/Android/i)) {
				//					console.log('Android');
				//					//修复android
				//					var encoder = new JPEGEncoder();
				//					base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), quality*100);
				//				}
				else {
					//					alert(Orientation);
					if(Orientation != "" && Orientation != 1) {
						switch(Orientation) {
							case 6: //需要顺时针（向左）90度旋转
//								console.log('需要顺时针（向左）90度旋转');
								rotateImg(this, 'left', canvas);
								break;
							case 8: //需要逆时针（向右）90度旋转
//								console.log('需要顺时针（向右）90度旋转');
								rotateImg(this, 'right', canvas);
								break;
							case 3: //需要180度旋转
//								console.log('需要180度旋转');
								rotateImg(this, 'right', canvas); //转两次
								rotateImg(this, 'right', canvas);
								break;
						}
					}
					var mpImg = new MegaPixImage(drawImg);
					mpImg.render(canvas, {
						maxWidth: maxWidth,
						maxHeight: maxHeight,
						quality: quality,
						orientation: Orientation
					});

					base64 = canvas.toDataURL("image/jpeg");
				}
				//上传
				var uploadimgPath = uploadImage(base64);
//				console.log('图片地址', uploadimgPath);
				if(!uploadimgPath) {
					//删除添加的图片容器
					imageItem.remove();
					mui.toast('图片上传失败，请稍后重试')
					return;
				}

				//隐藏提示
				if(mui('.alt')[0]) {
					mui('.alt')[0].remove();
				}

				imageItem.setAttribute('data-imgpath', uploadimgPath);
				var imageClose = document.createElement("div")
				imageClose.classList.add('image-close');
				//imageClose.classList.add('fm-arial');
				//imageClose.innerText = 'x';
				imageClose.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
				imageClose.setAttribute('onclick', 'deleteImg(this)');
				var imgEle = document.createElement("img")
				imgEle.setAttribute("src", base64);
				imagefile.appendChild(imgEle);
				imageItem.appendChild(imageClose);

				//去除loading
				imageLoading.remove();

				//清空上传控件
				fileObj.outerHTML = fileObj.outerHTML;
			};
		};
		oReader.readAsDataURL(file);
	}
}

//对图片旋转处理 added by lzk
function rotateImg(img, direction, canvas) {
	//最小与最大旋转方向，图片旋转4次后回到原方向  
	var min_step = 0;
	var max_step = 3;
	if(img == null) return;
	//img的高度和宽度不能在img元素隐藏后获取，否则会出错  
	var height = canvas.height;
	var width = canvas.width;
	//		alert(width + ',' + height);
	var step = 2;
	if(step == null) {
		step = min_step;
	}
	if(direction == 'right') {
		step++;
		//旋转到原位置，即超过最大值  
		step > max_step && (step = min_step);
	} else {
		step--;
		step < min_step && (step = max_step);
	}
	//旋转角度以弧度值为参数  
	var degree = step * 90 * Math.PI / 180;
	var ctx = canvas.getContext('2d');
	//	ctx.fillStyle = "#FFFFFF";
	//	ctx.fillRect(0, 0, width, height);
	switch(step) {
		case 0:
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0, width, height);
			break;
		case 1:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, 0, -height, height, width);
			break;
		case 2:
			canvas.width = width;
			canvas.height = height;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, -height, width, height);
			break;
		case 3:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, 0, height, width);
			break;
	}
}

/** 记录上传数据 */
function uploadImage(imageData) {
	var imgpath = null;
	if(!imageData) {
		return null;
	}
	mui.ajax({
		type: "post",
		async: false,
		url: "/file/base64/",
		data: {
			imgdata: imageData
		},
		dataType: 'json',
		success: function(data) {
//			console.log(["七牛图片地址", data]);
			imgpath = data.status ? data.imgpath : null;
		}
	});
	return imgpath;
}
//删除当前图片
function deleteImg(ele) {
	ele.parentNode.remove();
}

//收起键盘
var isIPHONE = navigator.userAgent.toUpperCase().indexOf('IPHONE') != -1;
var inputarr = mui('textarea');

function inputblur() {
	setTimeout(function() {
		for(var i = inputarr.length - 1; i >= 0; i--) {
			if(isIPHONE) {
				inputarr[i].click();
			}
			inputarr[i].blur();
		}
	}, 30)
}