var syncReq = require("../util/pub").syncReq,
    wx = require("../weixin/wx"),
    wxpay = require('../../conf/wxpay');
module.exports = {
    toLogin: function(req, res){
        var url = [
            "https://open.weixin.qq.com/connect/qrconnect",
            "?appid=",
            wxpay.WX_WOP_APPID,
            "&redirect_uri=",
            wxpay.WX_WOP_LOGIN_URI,
            "&response_type=code",
            "&scope=",
            wxpay.WX_WOP_SCOPE,
            "&code=skip_filter_scope", // 由于框架中微信拦截器拦截scope参数的请求
            "&state=STATE#wechat_redirect"
        ];
        // 跳转到二维码
        res.redirect(url.join(""));
    },
    login: function(req, res) {
        console.log("req.locals====>", res.locals);

        // 获取openid
        var openid = req.session.openid,
            result = null,
            _params = {},
            msg = {}; // 返回到页面

        // 如果session中无openid， 那么去查询微信详细信息
        if(!openid){
            // 将openid放入session中
            var wechat_info = wx.getOpenIdForWOP(req);
            result = wx.getUserInfo(req);

            // 登陆/注册参数
            _params = {
                halokitauthplatforms: [{
                    platformtype: 1,
                    platformaccount: result.nickname,
                    authid: result.unionid
                }],
                halokitmemberext: [{
                    sex: result.sex,
                    nickname: result.nickname,
                    city: result.city,
                    imagepath: result.headimgurl
                }],
            };
        }else{
            _params = {
                halokitauthplatforms: [{
                    platformtype: 1,
                    authid: openid
                }]
            }

        }
        
        // 三方登陆接口
        var member = syncReq({
            method: "POST",
            url: "/login/tp",
            data: _params
        });

        if(member.status){
        	member.data = member.data.data;
            msg = {
                imagepath: member.data.halokitmemberext[0].imagepath,
                username: member.data.username
            };

            console.log(" ====> 登录信息", member);

            req.session.memberid = member.data.id;
            req.session.username = msg.username;
        }

        res.render("pc/index", msg);
    }
}
