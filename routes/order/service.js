var syncReq = require("../util/pub").syncReq;

module.exports = {
    init: function(req, res) { // 个人订单中心
    	var id = req.params.id,
    		status = req.query.status;
    	// 查询订单
    	var _result = syncReq({
            method: "GET",
            url: "/web/order/" + id + "?ispage=false&status=" + status
        });

        res.render('order/index', { data: _result.status ? _result.data.data : null, status: status });
    }
}
