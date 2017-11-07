var syncRequest = require('sync-request'),
	querystring = require("querystring");

module.exports = {
    login: function(req, res) {
    	var access_token = req.cookies.access_token,
    		openid = req.query.openid,
    		_params = querystring.stringify({
            	access_token: access_token,
            	oauth_consumer_key: "101348052",
            	openid: openid
            });
            
        // 获取qq登陆信息
    	result = syncRequest("GET", "https://graph.qq.com/user/get_user_info?" + _params);
		result = JSON.parse(result.getBody('utf-8'));

        console.log(openid, result);

        // 登陆状态（临时）
        req.session.nickname = result.nickname;
        res.json(result);
    },
    redirect: function(req, res){
    	res.render("pc/index");
    }
}
