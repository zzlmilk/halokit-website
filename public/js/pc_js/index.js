/**
 * Created by sheryl(tiantianl417@163.com) in 2016-07-28.
 */
! function($) {
    "use strict";

    // 浏览器对象高度
    var bh = document.documentElement.clientHeight;

    // 滚动对象
    var scroll = {
        lock: false,
        index: 0,
        init: function(index){
            var base = this;
            this.lock = false;
            this.index = index;
            
            // 初始化视频播放器高度
            $("#video-page").height(bh);

            var _old = 0;
            window.onscroll = function(){
                var _top = document.body.scrollTop;
                if( (_top - _old > 25) && _top <= bh){
                    base.scroll(0, bh);
                }else{
                    base.lock = false;
                    base.index = _top;
                }
                _old = _top;

            }
        },
        scroll: function(x, y){
            var base = this;
            if(base.lock) return;
            base.lock = true;
            // 定时器
            this.timer(function(){
                base.index+=5 + ~~(base.index/100);
                window.scrollTo(base.index>=x?x: base.index, base.index>=y?y: base.index);
                if(base.index >= y && base.index >= x) return true;
            }, 1000/600);
        },
        timer: function(calb, e){
            var base = this,
                flog = calb();
            if(flog) return;
            setTimeout(function(){
                base.timer(calb, e)
            }, e);
        }
    };

    // 产品选择器
    var select = {

    };

    // 首页
    var index = {
        init: function(e){
            scroll.init(0)
        }

    };

    index.init();


    
}(jQuery);
