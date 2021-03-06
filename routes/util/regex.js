/**
* 正则表达式验证
*
*/
var _r = {
        regexStr: {
                number: /^[0-9]*$/,  //数字验证
                pint: /^[0-9]+$/, //整数
                pintege: /^[1-9]*[1-9][0-9]*$/, //正整数
                lintege: /^-[0-9]\d*$/, //负整数
                color: /^[a-fA-F0-9]{6}$/, //颜色
                zipcode: /^[0-9]{5,6}$/, //邮编
                qq: /^[1-9]*[1-9][0-9]*$/, //QQ号码
                username: /^\w+$/, //用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
                letter: /^[A-Za-z]+$/, //字母
                letter_u: /^[A-Z]+$/, //大写字母
                letter_l: /^[a-z]+$/, //小写字母
                decmal: /^([+-]?)\d*\.\d+$/, //浮点数
                decmal1: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, //正浮点数
                decmal2: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/, //负浮点数
                decmal3: /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, //浮点数
                decmal4: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/, //非负浮点数（正浮点数 + 0）
                decmal5: /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/, //非正浮点数（负浮点数 + 0）
                notempty: /^\S+$/, //非空验证
                picture: /(\.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/, //图片
                tel: /^0(10|2[0-5789]|\d{3})-{0,1}\d{7,8}$/, //电话号码
                IP: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])$/,  //ip地址验证
                //mobile: "^1(3[0-9]|5[0-35-9]|8[0235-9])\d{8}$",  //移动电话验证
                mobile: /^1(3|4|5|7|8)[0-9]\d{8}$/,//增加147段
                email: /[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/,  //邮箱验证
                //mail:"/^*@*+\.[a-zA-Z]{2,3}$/",
                idcard: /((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)\d{4})((((19|20)(([02468][048])|([13579][26]))0229))|((20[0-9][0-9])|(19[0-9][0-9]))((((0[1-9])|(1[0-2]))((0[1-9])|(1\d)|(2[0-8])))|((((0[1,3-9])|(1[0-2]))(29|30))|(((0[13578])|(1[02]))31))))((\d{3}(x|X))|(\d{4}))/, //身份证号验证
                chinese: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$/,  //中文字符
                url: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/  //http网址验证
        },lenBt: function(array, e){
                var type = typeof array;

                // array 类型判断 ， 以及e类型判断
                if(type.indexOf("[") === -1
                                && type.indexOf("object") !==-1
                                && array.length > 0
                                && typeof e === "string"){

                        // 如果只有一个数值，那么表示o到arrayp[0]个字符长度
                        if(array.length === 1){
                                array[1] = array[0];
                                array[0] = 0;
                        }

                        // 在此区间返回true
                        if(e.length >= array[0] && e.length <= array[1]) return true;
                }
                return false;
        }
};

// 自动将方法注入到_r 里面，以便直接使用
for(var i in _r.regexStr){
        (function(){
                var _i = i;
                _r[_i] = function(e){
                        return (_r.regexStr[_i]).test(e)
                }
        })();

}


module.exports = _r;