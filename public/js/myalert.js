(function(jq) {
    jq.fn.halokitAlert = function(options) {
        /**
         * content
         * width
         * */
        if (options && Object.prototype.toString.call(options).slice(8, -1) === "String") {
            if (_func[options]){
            	_func[options]();
            }else{
            	throw "参数错误";
            }
            return;
        }
        // 参数类型错误
        if (options && Object.prototype.toString.call(options).slice(8, -1) !== "Object") {
            throw TypeError();
        }
        if(!options){
        	_func["show"]();
        }else{
        	$("#halokit_alert_dom").remove();
        }

        options = $.extend({
            width: 300,
            content: "弹出框",
            closeBtn: ""
        }, options);
        var _dom = '<div id="halokit_alert_dom" style="position: fixed; z-index: 999; display:none;width: 100%; height: 100%; background-color: rgba(0, 0, 0, .7);top:0;left:0;"> <div style="width: $widthpx; max-height: 80%; overflow-y: auto; position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0); -webkit-transform: translate3d(-50%, -50%, 0); background-color: white;box-shadow: 0px 0px 2px black;"> $_here </div> </div>';
        _dom = _dom.replace(/\$width/g, options.width).replace(/\$_here/g, options.content);
        $(this).append(_dom);
        // 默认显示
        $("#halokit_alert_dom").show();
        $("#halokit_alert_dom").on("touchend", function(e){
        	if(e.target.id === "halokit_alert_dom")
        		_func["hide"]();
        })

        if(options.closeBtn){
            $(options.closeBtn).on("touchend", function(e){
                _func["hide"]();
            });
        }

    }
    // 对应方法
    var _func = {
        show: function(e) {
            $("#halokit_alert_dom").fadeIn();
        },
        hide: function(e) {
            $("#halokit_alert_dom").fadeOut();
        },
        destory: function(e) {
            $("#halokit_alert_dom").remove();
        }
    };
})($)
