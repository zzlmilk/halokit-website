(function(e) {
    // 前面放扫描相关的代码
    // 验证组件扫描class
    var _formList = $(".validate");

    // 正则表达式
    var _regexMap = e.regexMap = {
        number: /^[0-9]*$/, //数字验证
        pint: /^[0-9]+$/, //整数
        pintege: /^[1-9]*[1-9][0-9]*$/, //正整数
        lintege: /^-[0-9]\d*$/, //负整数
        color: /^[a-fA-F0-9]{6}$/, //颜色
        zipcode: /^[0-9]{5,6}$/, //邮编
        qq: /^[1-9]*[1-9][0-9]*$/, //QQ号码
        username: /^\w+$/, //用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        letter: /^[A-Za-z]+$/, //字母
        letter_u: /^[A-Z]+$/, //大写字母
        letter_l: /^[a-z]+$/, //小写字母
        decmal: /^([+-]?)\d*\.\d+$/, //浮点数
        decmal1: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, //正浮点数
        decmal2: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/, //负浮点数
        decmal3: /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, //浮点数
        decmal4: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/, //非负浮点数（正浮点数 + 0）
        decmal5: /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/, //非正浮点数（负浮点数 + 0）
        notempty: /^\S+$/, //非空验证
        picture: /(\.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/, //图片
        tel: /^0(10|2[0-5789]|\d{3})-{0,1}\d{7,8}$/, //电话号码
        ip: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])$/, //ip地址验证
        //mobile: "^1(3[0-9]|5[0-35-9]|8[0235-9])\d{8}$",  //移动电话验证
        mobile: /^1(3|4|5|7|8)[0-9]\d{8}$/, //增加147段
        email: /[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/, //邮箱验证
        //mail:"/^*@*+\.[a-zA-Z]{2,3}$/",
        idcard: /((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)\d{4})((((19|20)(([02468][048])|([13579][26]))0229))|((20[0-9][0-9])|(19[0-9][0-9]))((((0[1-9])|(1[0-2]))((0[1-9])|(1\d)|(2[0-8])))|((((0[1,3-9])|(1[0-2]))(29|30))|(((0[13578])|(1[02]))31))))((\d{3}(x|X))|(\d{4}))/, //身份证号验证
        chinese: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$/, //中文字符
        url: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/ //http网址验证
    };
    // 验证方法
    var _myRegex = e.myRegex = {
        notEmpty: function(e, dom) {
            if (dom[0].nodeName.toLowerCase() === "select") {
                return dom.val() != 0;
            } else {
                return (e + "").replace(/\s/g, "") ? true : false;
            }
        },
        between: function(e, dom) {
            //val = "between[0,12]"这样的类型
            var val = $(dom).attr("v-t").match(/between\[[0-9]+,[0-9]+\]/g)[0],
                shu = _blackBox(val);
            return (_regexMap.pint).test(e) && !(e < shu[0] || e > shu[1]);
        },
        length: function(e, dom) {
            var val = $(dom).attr("v-t").match(/length\[[0-9]+,[0-9]+\]/g)[0],
                shu = _blackBox(val);
            return !(e.length < shu[0] || e.length > shu[1]);
        }

    };

    // 传入input框上的属性 v-t， 返回参数数组
    function _blackBox(val) {
        try {
            // 数组转换
            var arr = val.match(/\d+/g);
            arr[0] = ~~arr[0];
            arr[1] = ~~arr[1];
            return arr;
        } catch (e) {
            console.error("参数错误");
            return null;
        }
    }

    // 自动注册map中的正则表达式
    for (var i in _regexMap) {
        (function() {
            var _i = i;
            _myRegex[_i] = e.myRegex[_i] = function(e) {
                return _regexMap[_i].test(e);
            }
        })();

    }

    /**
     * 处理验证提示
     * @param {Object} e
     * @param {Object} dom
     */
    function _f(e, dom) {
        if (!dom) dom = this;
        var flag = true,
            val = $(dom).val(),
            type = $(dom).attr("v-t"),
            msg = !val ? $(dom).attr("placeholder") : $(dom).attr("error-msg");

        // 多类型判断支持
        var _typeArr = type.split(" ");
        for (var i in _typeArr) {
            // 对type进行判断，如果传有参数，那么把参数去掉
            var _i = _typeArr[i].indexOf("[");
            var _type = _i > -1 ? _typeArr[i].substring(0, _i) : _typeArr[i];
            var _flag = _myRegex[_type](val, $(dom));
            if (!_flag) {
                break;
            }
        }



        if ($(dom).next("tip").length <= 0) {
            $("<tip class='linear-t un-select'>" + msg + "</tip>").insertAfter($(dom));
        }

        // 如果不是必填项 return
        if (!$(dom)[0].hasAttribute("req") && (val.length === 0)) {
            $(dom).removeClass("error").next("tip").html("").hide();
            return true;
        }
        // 如果是必填项，并且值为空
        if ($(dom)[0].hasAttribute("req") && (val.length === 0)) {
            $(dom).addClass("error").next("tip").html("此项不能为空").show();
            return false;
        }

        //验证内容
        if (!_flag) {
            flag = false;
            $(dom).addClass("error").next("tip").html(msg).show();
        } else {
            $(dom).removeClass("error").next("tip").hide();
        }
        return flag;
    }

    // 验证并且提示用户错误的信息
    var _validateForm = function(sub) {
        // 绑定监听
        $(_formList).focus(_f).change(_f);
        if (sub) {
            // 只有设定sub时才会触发该事件
            $(_formList).each(_f)
        }
        return this;

    }

    _validateForm.prototype.icheck = function() {
        var flag = true;
        for (var i = 0; i < _formList.length; i++) {
            if (!_f(null, _formList[i])) flag = false;
        }
        return flag;
    }



    // 引用js后从此处调用
    var Hi = e.Base = {
        winW: function() {
            return document.documentElement.offsetWidth || document.getElementsByTagName("body")[0].offsetWidth
        },
        winH: function() {
            return document.documentElement.clientHeight || document.body.clientHeight
        },
        myRegex: _myRegex,
        validateForm: _validateForm,
        getImg: _getImg,
        getImgRealWH: _getImgRealWH,
        parseForm: parseForm,
        json2FormData: json2FormData,
        template: template
    }

    // 外部调用
    function template() {
        var _global = this._global = "$*",
            _templates = document.getElementsByTagName("template"),
            _tmp_map = this._tmp_map = (function() {
                var _map = {};
                // 将模板保存到_tmp_map
                for (var i = 0; i < _templates.length; i++) {
                    var dom = _templates[i]
                    var name = dom.getAttribute("name");
                    if (!_map[name]) _map[name] = dom.innerHTML;
                }
                return _map;
            })();
    }
    // 此方法返回选然后的dom
    template.prototype.get = function(name, data) {
        var dom = this._tmp_map[name];
        for (var i in data) {
            var _val = data[i];
            // 模板自定义渲染函数 {format: function, value: value}
            if (data[i].format) {
                _val = data[i].format(data[i].value, data);
            }
            dom = dom.split(this._global + i).join(_val ? _val : "");
        }
        // 对没有处理的$key 进行空处理
        return dom.replace(/\$\*\w+(\[\d+\])?(\.\w+(\[\d+\])?){0,100}/ig, "");
    }





    /**
     * 转换图片为base64
     */
    function _getImg(file, calb) {
        var picture = /(\.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/; //图片
        if (!URL && file && picture.test(file.name)) {
            // 开始读取图片
            var reader = new FileReader();
            reader.onloadstart = function(e) {
                //不处理
            }
            reader.onload = function(e) {
                // 返回图片
                if (e.target.readyState === 2 && calb) {
                    calb(e.target.result);
                }
            }
            reader.onloadend = function(e) {
                if (arguments[3]) arguments[3](e);
            }
            reader.onprogress = function(e) {
                if (arguments[4]) arguments[4](e);
            }
            reader.onerror = function(e) {
                if (arguments[2]) arguments[2](e);
            }
            reader.onabort = function(e) {
                if (arguments[2]) arguments[2](e);
            }
            reader.readAsDataURL(file);

        } else {
            calb(URL ? URL.createObjectURL(file) : null);
        }
    }

    /**
     *  获取img标签真实高度，宽度
     * @param {Object} imgDom
     */
    function _getImgRealWH(e) {
        var result = {
            width: 0,
            height: 0
        }
        if (typeof e === "string") {
            var img = new Image();
            img.src = e;
            result.width = img.width;
            result.height = img.height;
            return result;
        }
        if (e) {
            if (e.naturalWidth && typeof e.naturalWidth === "undefined") {
                var img = new Image();
                img.src = e.src;
                result.width = img.width;
                result.height = img.height;
                return result;
            } else {
                result.width = e.naturalWidth;
                result.height = e.naturalHeight;
                return result;
            }
        }

    }
    /**
     * 检查数据类型，返回字符串
     * @param {Object} obj
     */
    function _type(obj) {
        return Object.prototype.toString.call(obj);
    }


    /**
     * 对象继承
     * @param {Object} base
     * @param {Object} e
     */
    function extend(base, e) {
        for (var i in e) {
            base[i] = e[i];
        }
        return base;
    }

    function json2FormData(obj) {
        var map = {},
            key = "";

        function init(obj, key) {
            for (var i in obj) {
                var _key = key;
                if (_type(obj[i]) === "[object Object]") {
                    if (_type(obj) === "[object Array]") {
                        _key += "[" + i + "].";
                    } else {
                        _key += i + ".";
                    }
                    arguments.callee(obj[i], _key);
                } else if (_type(obj[i]) === "[object Array]") {
                    if (_type(obj) === "[object Array]") {
                        _key += "[" + i + "].";
                    } else {
                        _key += i;
                    }
                    arguments.callee(obj[i], _key);
                } else {
                    _key += i;
                    map[_key] = obj[i];
                }
            }
        };
        init(obj, key);
        return map;
    }
    /**
     *  解析formDom下，iptCls 的数据，并返回json对象
     * 
     */
    function parseForm(formDom, iptCls) {
        var arr = $(formDom).find(iptCls ? iptCls : ".form-data");
        var user = {};
        var valueMap = _val(arr);
        for (var i = 0; i < arr.length; i++) {
            if (!arr[i].name) continue;
            // 将name属性根据. 拆分
            var nameArr = arr[i].name.split("."),
                val = valueMap[arr[i].name];
            // 解析，并且赋值, 当name重复时，后面的值会覆盖前面的

            _parse(nameArr, 0, user, false, val);
        }

        return user;

        // 返回false用于判断选中
        function _val(arr) {
            var result = {};
            for (var i = 0; i < arr.length; i++) {
                var _value = [];
                switch (arr[i].type) {
                    case "radio":
                        if (arr[i].checked) {
                            _value = arr[i].value;
                            result[arr[i].name] = _value;
                        }
                        break;
                    case "checkbox":
                        if (arr[i].checked) {
                            _value = arr[i].value;
                            if (!result[arr[i].name]) result[arr[i].name] = [];
                            result[arr[i].name].push(_value);
                        }
                        break;
                    default:
                        _value = arr[i].value;
                        result[arr[i].name] = _value;
                        break;
                }
            }
            return result;
        }


        // 对formName进行解析
        function _parse(_arr, i, obj, flag, val, prevIndex) {
            var key = "",
                typeOfArr = false;
            if (i !== _arr.length - 1) {
                if (/\w+\[[0-9]+\]$/.test(_arr[i])) {
                    key = _arr[i].replace(/\[[0-9]+\]$/g, "");
                    prevIndex = ~~(_arr[i].match(/\[[0-9]+\]$/)[0].replace("[", "").replace("]", ""));
                    typeOfArr = true;
                    // 父节点类型是array
                    if (flag) {
                        if (!obj[prevIndex]) obj[prevIndex] = {};
                        obj[prevIndex][key] = [];
                    } else {
                        if (!obj[key]) obj[key] = [];
                    }
                } else {
                    key = _arr[i];
                    if (flag) {
                        if (!obj[prevIndex]) obj[prevIndex] = {};
                        obj[prevIndex][key] = {};
                    } else {
                        if (!obj[key]) obj[key] = {};
                    }
                }
                arguments.callee(_arr, i + 1, flag ? obj[0][key] : obj[key], typeOfArr, val, prevIndex);
            } else {
                // 最后一项一定是字符串
                if (flag) {
                    if (!obj[prevIndex]) obj[prevIndex] = {};
                    obj[prevIndex][_arr[i]] = val;
                } else {
                    obj[_arr[i]] = val;
                }
            }
        }
    }


    /* 为页面左侧菜单注册点击事件, 需要jquery支持*/
    if ($('#mainNav').length > 0) {
        $('#mainNav').on('click', '.nav-dir', function() {
            $(this).closest('li').toggleClass('active');
        });
    }



    // 进行全局设置加载动画
    var MSG_BOX = '<div id="ajax-load-msg-box" class="tip"><span class="h5-loader"></span>$msg</div>';
    Base.setTip = function(e) {
        if ($("#ajax-load-msg-box")[0]) {
            $("#ajax-load-msg-box").text(e).show();
            return $("#ajax-load-msg-box");
        }
        MSG_BOX = MSG_BOX.replace(/\$msg/g, e);
        $(MSG_BOX).appendTo($("body")).show();
        return $("#ajax-load-msg-box");
    }

    // 全局设置
    $.ajaxSetup({
        beforeSend: function() {
            // 开始加载动画
            if ($("#ajax-load-msg-box")[0]) {
                $("#ajax-load-msg-box").addClass("show");
                return;
            }
            $(MSG_BOX).appendTo($("body")).addClass("show");
            return true;
        },
        complete: function() {
            // 关闭加载动画
            setTimeout(function() {
                $("#ajax-load-msg-box").removeClass("show");
            }, 200);
        }
    });

    // 公开公用变量
    e.Method = {
        POST: "POST",
        GET: "GET",
        PUT: "PUT",
        DELETE: "DELETE"
    };


})(window);
