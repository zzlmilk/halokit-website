! function($) {
    "use strict";
    var $service = $('#service'),
    	$subscription = $('#subscription'),
        Ts = (function() {
            var $mask = $('#mask'),
                $close = $('.close'),
                close = function() {
                    $mask.hide();
                    $service.hide();
                    $subscription.hide();
                };
            return {
                openSer: function() {
                    $mask.show();
                    $service.show();
                    $close.click(function() {
                        close();
                    });
                    $mask.click(function() {
                        close();
                    });
                    return false;
                },
                openSub: function() {
                    $mask.show();
                    $subscription.show();
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



    //微信公众号
    $('#to-service').click(function() {
        Ts.openSer();
    });

    //微信订阅号
    $('#to-subscription').click(function() {
        Ts.openSub();
    });

}(jQuery);
