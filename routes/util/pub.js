/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-18.
 * [公共函数]
 */

var syncRequest = require('sync-request'),
    conf = require('../../conf/conf'),
    wx = require('../../conf/wxpay'),
    STATUS_SUCCESS = {
        "get": 200,
        "post": 201,
        "put": 205,
        "delete": 205
    },
    _export = {
        syncReq: function(_req_obj) {
            // 参数_req_obj格式为：{method: string, url: string, status: number[, data: json]}
            // 返回值格式为：{ status: true,  data: obj OR { status: false,  msg: string}
            var _info = { status: false },
                _reqObj = null,
                _returnObj = null,
                _method = _req_obj.method.toLowerCase(),
                _url = null;
            // 如果url带 http[s] 那么
            if (/http[s]?:\/\//.test(_req_obj.url)) {
                _url = _req_obj.url;
            } else {
                _url = ['http://',
                    conf.HOST_IP,
                    ':',
                    conf.HOST_PORT,
                    conf.POJECT,
                    _req_obj.url
                ].join('');
            }
            // 如果是get的请求方式，拼接参数
            if ("get" === _method) {
                var url = ["?"];
                // 拼接data
                for (var i in _req_obj.data) {
                    url.push(i + "=" + _req_obj.data[i]);
                    url.push("&");
                }
                // 去掉最后一个&
                url.length = url.length - 1;
                _url += url.join("");
                _url = encodeURI(_url);
            }
            console.log(_url);
            try {
                _reqObj = syncRequest(_method, _url, { "json": _req_obj.data } || null);
                _returnObj = JSON.parse(_reqObj.getBody('utf-8'));
//              console.log('正确返回的数据',_returnObj);
                if (_reqObj.statusCode === 200) {
                    if (_returnObj.status === STATUS_SUCCESS[_method]) {
                        _info.status = true;
                        _info.data = _returnObj;
                    } else if (_returnObj.status === 404) {
                        _info.msg = '没有获取到任何数据';
                    } else {
                        _info.msg = '操作失败：' + (_returnObj.message || '');
                    }
                } else {
                    console.log('请求路径：' + _url + '服务器出错（' + _reqObj.statusCode + '）：' + _returnObj);
                    _info.msg = '请求错误';
                }
            } catch (e) {
                console.log('请求路径：' + _url + '异常：' + e);

                _info.msg = '未知错误';
            }
            // respond 返回数据
            return _info;
        },
        loginFilter: function(req, res, next) { // 登录拦截
            var allowUrl = conf.allowUrl,
                allUrlLen = allowUrl.length,
                reqUrl = req.url.slice(0, req.url.indexOf('?') === -1 ? req.url.length : req.url.indexOf('?'))
            allow = true;

            while (allUrlLen--) {
                var _allowUrl = allowUrl[allUrlLen];
                _allowUrl = (_allowUrl.lastIndexOf("*") === (_allowUrl.length - 1))? _allowUrl: (_allowUrl + "$");
                var reg = new RegExp(_allowUrl);
                if (reg.test(reqUrl)) {
                    allow = false;
                    break;
                }
            }

            if (allow && !req.session.username) {
                // 重定向到首页，并且弹出登录框
                res.redirect('/#unlogin');
                return;
            }
            // 传递到页面的
            res.locals.username = req.session.username;
            res.locals.memberid = req.session.memberid;
            next();
        },
        ie: function(req, res, next) {
            // ie 拦截
            console.log(req.headers["user-agent"]);
            if (req.headers["user-agent"].indexOf("Trident/7.0") !== -1) {
                res.render("common/chorme");
            } else {
                next();
            }

        },
        wx: function(req, res, next) {
            // 微信拦截器（只支持http请求），如果配置了_scope 那么要重定向至微信接口
            // 请求方式： 任意uri?scope=snsapi_base
            var _scope = req.query.scope,
                _hasCode = req.query.code,
                _baseUrl = "http://" + req.headers["host"] + req.originalUrl;
            // .replace(/scope=\w*/ig, "") 
            if (!_hasCode && _scope) {
                var _url = [
                    "https://open.weixin.qq.com/connect/oauth2/authorize",
                    "?appid=",
                    wx.WX_APPID,
                    "&redirect_uri=",
                    encodeURIComponent(_baseUrl),
                    "&response_type=code",
                    "&scope=",
                    ("snsapi_userinfo" === _scope) ? "snsapi_userinfo" : "snsapi_base",
                    "&state=STATE#wechat_redirect"
                ];
                console.log(_url.join(""));
                res.redirect(_url.join(""));
            } else {
                next();
            }
        }


    };


module.exports = _export;
