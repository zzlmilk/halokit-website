! function($) {
    "use strict";
    var $videoLayer = $('#video-layer'),
        $videoPage = $('#video-page'),
        $fullVideo = $('#fullVideo'),
        $partVideo = $('#part-video'),
        Tv = (function() {
            var $mask = $('#mask'),
                $close = $('.close-video'),
                close = function() {
                    $mask.hide();
                    $videoLayer.hide();
                    $fullVideo.trigger('pause');
                    $partVideo.trigger('play');
                };
            return {
                openVideo: function() {
                    $mask.show();
                    $videoLayer.show();
                    $fullVideo.trigger('play');
                    $partVideo.trigger('pause');
                    $close.click(function() {
                        close();
                    });
                    $mask.click(function() {
                        close();
                    });
                    return false;
                }

            };
        })();
	
	if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
		$partVideo.attr("src","/media/aboutHalokit.mp4").trigger('play');
	}else{
		$partVideo.remove();
	}


    //点击观看完整视频
    $('#video-btn').on('click',function() {
//      Tv.openVideo();
		window.open("http://v.qq.com/x/page/l03411jay4o.html");
    });

}(jQuery);
