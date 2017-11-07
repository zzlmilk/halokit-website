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



    //点击观看完整视频
    $('#video-btn').click(function() {
        Tv.openVideo();
    });

}(jQuery);
