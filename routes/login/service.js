/**
 * Created by sheryl(tiantianl417@163.com) in 2016-07-13.
 */
var syncReq = require("../util/pub").syncReq;

module.exports = {
    init: function(req, res) {
        res.render('login/index');
    },
    login: function(req, res) {
        console.log(req.session);
        var info = {
                status: false,
                msg: ''
            },
            phone = req.body.phone,
            password = req.body.password;
        
        try {
            var params = {
                url: "/login",
                method: "POST",
                data: {
                    mobile: phone,
                    loginpassword: password
                }
            };
            info = syncReq(params);
            // {status: true| false ,data: {status : 201 , data : {}}}
            if (info.status) {
                // 后台返回状态可登陆
                info.data = info.data.data;
                req.session.username = info.data.username;
            }

        } catch (e) {
            console.log(e);
            info.msg = "系统繁忙，请稍后";
        }
        res.json(info);



    },
    captcha: function(e){
        var result = syncReq({
            url: "http://127.0.0.1:3001/"
        })

    },
    logout: function(req, res) {
        delete req.session.username;
        delete req.session.openid;
        delete req.session.access_token;
        delete res.locals.memberid;
        delete res.locals.username;
        res.redirect("/");
    }
}
