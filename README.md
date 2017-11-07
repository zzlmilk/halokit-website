# halokit-website

- mongodb 作为SESSION 存储仓库
- express 基本框架
- 模板引擎为velocityjs
- views文件夹：为HTMl或者模板引擎文件
- public文件夹：为CSS IMG HTML JSON 等静态文件
- 项目打包使用了gulp工具
    > - public 文件夹下面有dist文件夹
    > - dist 文件夹 会存放css js 文件
    > - views 下面的html文件的引用 css： `/dist/css/*.css`
    > - views 下面的html文件的引用 js： `/dist/js/*.js`
    > - views 下面的html文件的引用 img： `/img/*.*`
- conf 为项目配置目录
    > - conf.js 为配置文件
    > - file-upload-config.js 文件上传配置文件
- util 为项目工具类
	> - util.js 为工具类方法
	> - pub.js 为公共方法文件
	> - regex.js 验证

# halokit-website
