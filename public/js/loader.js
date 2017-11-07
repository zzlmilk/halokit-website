/**
 * 加载
 * @param {Object} e
 * @param {Object} calb
 */
var loader = function(e, calb) {
    var _list = [];
    // 如果传入的是单文件，str
    if (typeof e !== "object") {
        _list.push(e);
    } else {
        _list = e;
    }
    // 加载不同类型的文件
    this.jsLoader = function() {
        var _loaderI = 0;
        (function() {
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.charset = "UTF-8";
            js.src = _list[_loaderI++];
            var arg = arguments;
            document.getElementsByTagName("head")[0].appendChild(js);
            js.onload = function(pp) {
                if (_list.length === _loaderI) {
                    calb(true, pp);
                    return;
                };
                arg.callee();
            }
        })();
    }

    this.cssLoader = function() {
        var _loaderI = 0;
        (function() {
            var css = document.createElement("link");
            css.rel = "stylesheet";
            css.charset = "UTF-8";
            css.src = _list[_loaderI++];
            document.getElementsByTagName("head")[0].appendChild(js);
            var arg = arguments;
            css.onload = function(pp) {
                if (_list.length === _loaderI) {
                    calb(pp);
                    return;
                };
                arg.callee();
            }
        })();
    }

    this.imgLoader = function() {
        var _loaderI = 0;
        for(var i in _list){
        	var img = new Image();
            img.src = _list[i];
            img.onload = function(pp) {
            	_loaderI++;
                if (_list.length === _loaderI) {
                    calb(pp);
                    return;
                };
            }
        }
    }

}


/**
 * 初始化页面
 * 初始化内容区域宽度
 * 当窗口大小改变，内容宽度也改变
 */
function _init_content_w() {
    var asside = document.getElementsByClassName("aside")[0],
        header = document.getElementsByTagName("header")[0],
        content = document.getElementById("allWrap"),
        winW = document.documentElement.offsetWidth || document.getElementsByTagName("body")[0].offsetWidth,
        winH = document.documentElement.clientHeight || document.body.clientHeight;
    if (asside && winW > 1000) {
        content.style.width = winW - asside.offsetWidth + "px";
        content.style.height = winH - header.offsetHeight + "px";
        content.style.display = "block";
    }

}
_init_content_w();
window.onresize = function() {
    _init_content_w();
}
