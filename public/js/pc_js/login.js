/**
 * Created by sheryl(tiantianl417@163.com) in 2016-07-20.
 */
 
// qq登录
function callback(e){
    $.get("/login/qq?openid=" + e.openid, function(e){
        $("#username span").text(e.nickname);
    });
}
! function($) {
    "use strict";
    var $login = $('#login'),
        $register = $('#register'),
        Lg = (function() {
            var $err = $('.error'),
                $mask = $('#mask'),
                $iptItem = $('.ipt-item'),
                $closeBtn = $('.close-btn'),
                $beforeLogin = $('#before-login'),
                $afterLogin = $('#after-login'),
                close = function() {
                    $mask.hide();
                    $login.hide();
                    $register.hide();
                    $err.empty();
                    $iptItem.val('');
                };
            return {
                openLogin: function() {
                    $mask.show();
                    $login.show();
                    $closeBtn.click(function() {
                        close();
                    });
                    $mask.click(function() {
                        close();
                    });
                    return false;
                },
                toOpenRegister: function() {
                    $login.hide();
                    $register.show();
                },
                login: function() {
                    var _data = {
                        password: this.checkPassword(),
                        phone: this.checkPhone()
                    };

                    //验证通过
                    if (_data["phone"] && _data["password"]) {
                        $err.attr({
                            style: "color: #bcc91c"
                        }).html("登录中，请稍后...");

                        $.ajax({
                            url: '/login/login',
                            type: 'POST',
                            dataType: 'json',
                            data: _data,
                            success: function(e) {
                                if (e.status) {
                                    close();
                                    $beforeLogin.hide();
                                    $afterLogin.removeClass('none').find('#username span').html(e.data.username);
                                } else {
                                    $err.attr({
                                        style: "color: red"
                                    }).html(e.msg);
                                }
                            },
                            error: function(e) {
                                $err.attr({
                                    style: "color: red"
                                }).html("登录失败，请重试");
                            }
                        })

                    }

                },
                checkPhone: function() {
                    var $phone = $("#phone"),
                        phone = $phone.val().replace(/^\s+$/ig, "");
                    //判断空值
                    if (!phone) {
                        $err.html("手机号不能为空!");
                        $phone.focus();
                        return false;
                    }
                    if (!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(phone)) {
                        $err.html("请输入正确的手机号!");
                        $phone.focus();
                        return false;
                    }
                    return phone;
                },
                checkPassword: function() {
                    var $password = $("#password"),
                        password = $password.val().replace(/^\s+$/ig, "");
                    //判断空值
                    if (!password) {
                        $err.html("密码不能为空!");
                        $password.focus();
                        return false;
                    }
                    if (!/^\w{6,20}$/.test(password)) {
                        $err.html("密码错误，请重新输入!");
                        $password.focus();
                        return false;
                    }
                    return password;
                },


            };
        })();


    // 为了通过审核默认弹出登录
    // Lg.openLogin();
    //头部点击登录
    $('#to-login').click(function() {
        Lg.openLogin();
    });

    //登录框内点击注册
    $('#login-to-register').click(function() {
        Lg.toOpenRegister();
    });

    //登录框点击登录
    $login.on('click', '.login-btn', function() {
        Lg.login();
    });
    //回车
    document.body.onkeydown = function(e) {
        if (e.keyCode === 13) Lg.login();
    }

    $("#qqlogin").click(function(e){
        var _url = [
            "https://graph.qq.com/oauth2.0/authorize",
            "?response_type=token",
            "&client_id=",
            "101348052",
            "&redirect_uri=",
            encodeURIComponent("http://halokit.cn/login/redirect")
            // encodeURIComponent("http://3797cb4.ngrok.natapp.cn/login/redirect")
        ];

        window.location.href = _url.join("");

    });




    /* --------- 三方登录QQ ---------- */
    var _hash = window.location.hash.slice(1);
    if(_hash){
        // window.location.hash = "";
        var access_token = null;
        try{
            access_token = _hash.split("&")[0].split("=")[1];
        }catch(e){
            console.log(e);
        }
        if(access_token){
            $.cookie('access_token', access_token, { expires: 1 });
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.charset = "UTF-8";
            js.src = "https://graph.qq.com/oauth2.0/me?access_token=" + access_token;
            document.getElementsByTagName("head")[0].appendChild(js);
        }
        
    }

    if(_hash.indexOf("unlogin") != -1){
        Lg.openLogin();
    }
    /* --------- 三方登录 ---------- */

}(jQuery);
