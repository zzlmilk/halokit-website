var identifyingcode = 0;
mui.init();

var input_account = mui('#account'),
	input_code = mui('#code'),
	input_petnickname = mui('#petnickname');

mui(document.body).on('tap', '#btnBinding', function(e) {
	var btn = mui(this),
		phoneNumber = input_account[0].value,
		codeNumber = input_code[0].value,
		petnicknameStr = input_petnickname[0].value;

	//手机号码判断
	if(phoneNumber.replace(/ /g, '') == '') {
		mui.toast('请输入手机号码');
		return;
	}
	if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(phoneNumber)) {
		mui.toast('手机号码输入错误，请检查');
		return;
	}
	//宠物昵称判断
	if(petnicknameStr.replace(/ /g, '') == '') {
		mui.toast('请输入宠物昵称');
		return;
	}
	if(petnicknameStr.length > 25) {
		mui.toast('宠物昵称最做只能25位哦');
		return;
	}
	//验证码判断
	if(codeNumber.replace(/ /g, '') == '') {
		mui.toast('请输入验证码');
		return;
	}
	if(codeNumber != identifyingcode) {
		mui.toast('验证码输入错误，请重新输入');
		return;
	}
	btn.button('loading');
	//注册
	mui.ajax('/register/register', {
		async: false,
		type: 'POST',
		dataType: 'json', //服务器返回json格式数据
		data: {
			phone: phoneNumber,
			petnikename: petnicknameStr,
			code: codeNumber
		},
		success: function(data) {
			btn.button('reset');
			console.log('返回数据', data);
			if(data.status) {
				btn[0].classList.add("mui-disabled");
				mui.toast('注册成功');
				setTimeout(function() {
					window.location.href = '/sos/';
				}, 2000)
			} else {
				mui.toast('操作失败，请稍后重试');
			}
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('操作失败，请关闭页面后重新尝试');
		}
	});
});

mui(document.body).on('tap', '#btnGetVcode', function(e) {
	var phoneNumber = input_account[0].value;
	//手机号码判断
	if(phoneNumber == '') {
		mui.toast('请输入手机号码');
		return;
	}
	if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(phoneNumber)) {
		mui.toast('手机号码输入错误，请检查');
		return;
	}

	//发送短消息
	mui.getJSON('/h5/authcode/' + phoneNumber, function(data) {
		console.log(['验证码', data]);
		if(data.status) {
			identifyingcode = data.data.data;

		} else {
			mui.toast('操作失败，请稍后重试');
		}
	});
	var timeout = 60;
	mui(this).button('loading');
	SmsTimeOut(timeout);
});

function SmsTimeOut(timeout) {
	mui('#btnGetVcode span')[1].innerText = timeout + " 秒";
	setTimeout(function() {
		mui('#btnGetVcode span')[1].innerText = timeout + " 秒";
		timeout--;
		if(timeout > 0) {
			SmsTimeOut(timeout);
		} else {
			mui('#btnGetVcode').button('reset');
		}
	}.bind(this), 1000);
}