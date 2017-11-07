/**
 * [app.use
 * 第一个参数为路由 eg: http://localhost:3001/login 表示 下面的第二行，表示进入登录页面
 * 第二个参数为路由执行的控制器的require 的 模块]
 * reated by hangyangws in 2016-03-01
 */
module.exports = function(app) {
//  app.use('/', require('./index/controller'));
    app.use('/', require('./website/controller'));
	app.use('/downloads', require('./downloads/controller'));
	app.use('/sos', require('./sos/controller'));
	app.use('/file', require('./file/controller'));
    app.use('/about', require('./about/controller'));
	app.use('/wechat', require('./wechat/controller'));
	
    app.use('/pay', require('./pay/controller'));
    app.use('/h5', require('./h5/controller'));
    app.use('/login', require('./login/controller'));
    app.use('/register', require('./register/controller'));
    app.use('/cart', require('./cart/controller'));
    app.use('/change', require('./change/controller'));
    app.use('/info', require('./info/controller'));
    app.use('/order', require('./order/controller'));
    app.use('/success', require('./success/controller'));
}
