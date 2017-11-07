$(function(e) {


    var $register = $('#register'),
        $login = $('#login'),
        Rg = (function() {
            var $reErr = $('.reError'),
                $iptItem = $('.ipt-item'),
                $mask = $('#mask'),
                close = function() {
                    $mask.hide();
                    $register.hide();
                    $login.hide();
                    $reErr.empty();
                    $iptItem.val('');
                }
            return {
                openRegister: function() {
                    $mask.show();
                    $register.show();
                    $('.close-btn').click(function() {
                        close();
                    });
                    $mask.click(function() {
                        close();
                    });
                    return false;
                },
                register: function() {
                    var _data = {
                        rePassword: this.checkRePassword(),
                        newPassword: this.checkNewPassword(),
                        reCaptcha: this.checkCaptcha(),
                        rePhone: this.checkRePhone()
                    };

                    //验证通过
                    if (_data["rePhone"] && _data["reCaptcha"] && _data["newPassword"] && _data["rePassword"]) {
                        //点击注册后，删除注册框，出现登录框
                        $reErr.attr({
                            style: "color: #bcc91c"
                        }).html("注册中，请稍后...");
                        $.ajax({
                            url: '/register/register',
                            type: 'POST',
                            dataType: 'json',
                            data: _data,
                            success: function(e) {
                                if (e.status) {
                                    $reErr.css('color', '#bcc91c').html("注册成功，跳转登录...");
                                    $register.fadeOut(800);
                                    $login.show();
                                } else {
                                    $reErr.attr({
                                        style: "color: red"
                                    }).html(e.msg);
                                }
                            },
                            error: function(e) {
                                $reErr.attr({
                                    style: "color: red"
                                }).html("注册失败，请重试");
                            }
                        })

                    }
                },
                checkRePhone: function() {
                    var $rePhone = $('#rePhone'),
                        rePhone = $rePhone.val().replace(/^\s+$/ig, "");
                    //判断空值
                    if (!rePhone) {
                        $reErr.html("手机号不能为空");
                        $rePhone.focus();
                        return false;
                    } else if (!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(rePhone)) {
                        $reErr.html("请输入正确的手机号!");
                        $rePhone.focus();
                        return false;
                    }
                    return rePhone;
                },
                checkCaptcha: function() {
                    var $reCaptcha = $('#reCaptcha'),
                        reCaptcha = $reCaptcha.val().replace(/^\s+$/ig, "");
                    //判断空值
                    if (!reCaptcha) {
                        $reErr.html("验证码不能为空");
                        $reCaptcha.focus();
                        return false;
                    } else if (!/^\d{4}$/.test(reCaptcha)) {
                        $reErr.html("请正确输入验证码!");
                        $reCaptcha.focus();
                        return false;
                    }
                    return reCaptcha;
                },
                checkNewPassword: function() {
                    var $newPassword = $('#newPassword'),
                        newPassword = $newPassword.val().replace(/^\s+$/ig, "");

                    //判断空值
                    if (!newPassword) {
                        $reErr.html("密码不能为空，请填写注册密码");
                        $newPassword.focus();
                        return false;
                    } else if (!/^\w{6,20}$/.test(newPassword)) {
                        $reErr.html("密码格式错误，请重新填写!");
                        $newPassword.focus();
                        return false;
                    }
                    return newPassword;
                },
                checkRePassword: function() {
                    var $rePassWord = $('#rePassword'),
                        $newPassword = $('#newPassword'),
                        newPassword = $newPassword.val().replace(/^\s+$/ig, ""),
                        rePassWord = $rePassWord.val().replace(/^\s+$/ig, "");
                    if (rePassWord != newPassword) {
                        $reErr.html("请确认两次输入的密码一样!");
                        $rePassWord.focus();
                        return false;
                    }
                    return rePassWord;
                }
            };
        })();

    // 发送短信验证码按钮
    $('#captcha-btn').click(function(e) {
        var _phone = Rg.checkRePhone();
        if (_phone) {
            $.get("http://127.0.0.1:3001/ali/dayu/" + _phone, function(e) {
                if (e.status) {
                    alert("验证码已经发送");
                } else {
                    alert(e.msg);
                }
            });
        }
    });

    //点击出现注册框
    $('#to-register').click(function() {
        Rg.openRegister();
    });

    //注册框点击注册
    $register.on('click', '.register-btn', function() {
        Rg.register();
    });


});
