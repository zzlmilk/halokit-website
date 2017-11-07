/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-13.
 */
var syncReq = require("../util/pub").syncReq;

module.exports = {
    init: function(req, res) {
        // 商品id是固定的
        var newData = {};
        // 请求
        var result = syncReq({
            method: "GET",
            url: "/web/commodity/bf22e28c896a4a75b0cdc2fa5d450c01"
        });
        if (result.status) {
            var _COMMODITY = result.data.data.commodities,
                _commodity_id = result.data.data.commodityid,
                _commodity_name = result.data.data.name;
            // 对结构数据进行重组，以便前端渲染
            _COMMODITY.forEach(function(e) {
                e.name = _commodity_name;
                newData.commodityid = _commodity_id;
                newData.name = _commodity_name;
                if (!newData.size) newData.size = {};
                if (!newData.size[e.size.id]) newData.size[e.size.id] = e.size;
                if (!newData.size[e.size.id].color) newData.size[e.size.id].color = {};
                if (!newData.size[e.size.id].color[e.sku]) {
                    e.color.id = e.sku;
                    newData.size[e.size.id].color[e.color.id] = e.color;
                }
                // newData.size[e.size.id].color[e.color.id].num = e.num;
                newData.size[e.size.id].color[e.color.id].price = e.price;
                newData.size[e.size.id].color[e.color.id].imagepath = e.imagepath;
                newData.size[e.size.id].color[e.color.id].ismarketable = e.ismarketable;
            });

        }
        console.log(newData);
        res.render("pc/index", { data: newData,nowYear:new Date().getFullYear() });
    },
    getCommodityInfo: function(req, res) {
    	var newData = {};
        // 请求
        var result = syncReq({
            method: "GET",
            url: "/web/commodity/bf22e28c896a4a75b0cdc2fa5d450c01"
        });
        if (result.status) {
            var _COMMODITY = result.data.data.commodities,
                _commodity_id = result.data.data.commodityid,
                _commodity_name = result.data.data.name;
            // 对结构数据进行重组，以便前端渲染
            _COMMODITY.forEach(function(e) {
                e.name = _commodity_name;
                newData.commodityid = _commodity_id;
                newData.name = _commodity_name;
                if (!newData.size) newData.size = {};
                if (!newData.size[e.size.id]) newData.size[e.size.id] = e.size;
                if (!newData.size[e.size.id].color) newData.size[e.size.id].color = {};
                if (!newData.size[e.size.id].color[e.sku]) {
                    e.color.id = e.sku;
                    newData.size[e.size.id].color[e.color.id] = e.color;
                }
                // newData.size[e.size.id].color[e.color.id].num = e.num;
                newData.size[e.size.id].color[e.color.id].price = e.price;
                newData.size[e.size.id].color[e.color.id].imagepath = e.imagepath;
                newData.size[e.size.id].color[e.color.id].ismarketable = e.ismarketable;
            });

        }
        res.json(newData);
    }
}
