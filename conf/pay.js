/**
* 支付宝支付配置
*/
var _export = {
    notify_url: 'http://e9f5830.ngrok.natapp.cn/pay/return', // 支付宝服务器通知的页面,http://格式的完整路径,不允许加?id:123这类自定义参数(外网访问)
    // notify_url: 'http://gqj8tq0ado.proxy.qqbrowser.cc/pay/notify',
    return_url: 'http://e9f5830.ngrok.natapp.cn/pay/return', // 支付宝处理完请求后,当前页面自动跳转到商户网站里指定页面的http路径。
    // return_url: 'http://gqj8tq0ado.proxy.qqbrowser.cc/pay/return', // 支付宝处理完请求后,当前页面自动跳转到商户网站里指定页面的http路径。
    key: 'gsgq7khai26i24rf6120ormr11kslulz', // 交易安全检验码,由数字和字母组成的32位字符串
    partner: '2088221611212545', // 2088221611212545  合作身份者ID,以2088开头由16位纯数字组成的字符串
    ALIPAY_HOST: 'mapi.alipay.com', // 支付宝接口地址
    ALIPAY_PATH: 'gateway.do', // 接口路径
    input_charset: 'utf-8', // 字符集、加密方式
    payment_type: '1', //-支付类型。仅支持：1（商品购买）-String(4)-No
    sign_type: 'MD5', // 支付验证方式
    service: 'alipay.wap.create.direct.pay.by.user',
    HTTPS_VERIFY_PATH: '/gateway.do?service=notify_verify&',
    _input_charset: 'utf-8' //-参数编码字符集,仅支持utf-8-String-No
};

module.exports = _export;
