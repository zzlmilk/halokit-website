/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-13.
 */

module.exports = {
    init: function(req, res) {
    	var id = req.params.id;
    	var _result = syncReq({
            method: "GET",
            url: "/order/" + id
        });

    	console.log("订单中心==》 ", _result);

        res.render('info/index', { data: _result.status ? _result.data.data : null});
    }
}
