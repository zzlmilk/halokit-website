module.exports = {
	show: function(req, res) {
		var deviceAgent = req.headers['user-agent'].toLowerCase();
		var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
		console.log(deviceAgent);
		res.render('downloads/index');
	},

}