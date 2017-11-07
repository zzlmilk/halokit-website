var syncReq = require("../util/pub").syncReq,
	util = require("../util/util"),
	fs = require("fs"),
	qiniu = require("qiniu");
	
module.exports = {
	base64: function(req, res) {

		try {

			var data = req.body.imgdata;
			if(!data || data.replace(/ /g, '') == '') {
				console.log('图片数据为空');
				res.json({
					status: false,
					msg: '图片写入失败'
				});
				return;
			}
//			console.log(data);
			//先存本地图片
			var tmpSavePath = process.cwd() + '/public/upload';
			var filename = util.UUID() + '.jpeg';
			var base64Data = data.replace(/\s/g, "+").replace(/^data:image\/\w+;base64,/, '');
			var dataBuffer = new Buffer(base64Data, 'base64');
			fs.writeFile(tmpSavePath + '/' + filename, dataBuffer, function(err) {
				if(err) {
					res.json({
						status: false,
						msg: '图片写入失败'
					});
					return;
				}
			});

			var _result = syncReq({
				url: "/qiniu/token",
				method: "GET"
			});
			var uptoken = _result.data.data;

			var extra = new qiniu.io.PutExtra();
			var filePath = tmpSavePath + '/' + filename;
			qiniu.io.putFile(uptoken, filename, filePath, extra, function(err, ret) {
				if(!err) {
					// 上传成功， 处理返回值
					console.log([
						'hash:',
						ret.hash,
						',key:', ret.key,
						',persistentId:',
						ret.persistentId
					].join(''));

					//删除本地文件
					fs.exists(filePath, function(exists) {
						if(exists) {
							fs.unlink(filePath);
						}
					});

					res.json({
						status: true,
						imgpath: 'http://7xwshy.com1.z0.glb.clouddn.com/' + ret.key
					});
				} else {
					// 上传失败， 处理返回代码
					console.log(err);
					res.json({
						status: false,
						msg: '上传失败'
					});
					return;
				}
			});
		} catch(err) {
			console.log(err);
			res.json({
				status: false,
				msg: '上传失败'
			});
		}

	}
}