/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-20.
 */

var gulp = require('gulp'),
    clean = require('gulp-clean'), // 文件清理
    minifycss = require('gulp-minify-css'), // css 压缩
    uglify = require('gulp-uglify'), // js 压缩
    browserSync = require('browser-sync').create(), // 浏览器刷新
    conf = require('./conf/conf'), // 项目配置文件
    myPath = {
        clearPath: [
            conf.staticSrc + '/dist/css',
            conf.staticSrc + '/dist/js'
        ],
        fromCSS: conf.staticSrc + '/css/**/*.css',
        toCSS: conf.staticSrc + '/dist/css',
        fromJS: conf.staticSrc + '/js/**/*.js',
        toJS: conf.staticSrc + '/dist/js',
        frontendWatch: [
            'views/**/*.html',
            'routes/**/*.js',
            'routes/index.js',
            conf.staticSrc + '/img/*.*',
            conf.staticSrc + '/dist/css/*.css',
            conf.staticSrc + '/dist/js/*.js'
        ]
    };

// 执行压缩前，先删除文件夹里的内容
gulp.task('clean', function() {
    return gulp.src(myPath.clearPath, { read: false }).pipe(clean());
});

// CSS 压缩
gulp.task('minCSS', function() {
    return gulp.src(myPath.fromCSS) // 源文件
        .pipe(minifycss()) // 执行压缩
        .pipe(gulp.dest(myPath.toCSS)); // 输出文件
});

// JavaScript 压缩
gulp.task('minJS', function() {
    return gulp.src(myPath.fromJS) // 需要操作的文件
        .pipe(uglify())
        .on('error', function(err) {
            console.log('minJs Error!', err.message);
            this.end();
        }) // 压缩
        .pipe(gulp.dest(myPath.toJS)); // 输出
});

// 监听js css 文件改动
gulp.task('watch', function() {
    gulp.watch(myPath.fromCSS, ['minCSS']);
    gulp.watch(myPath.fromJS, ['minJS']);
});

// 浏览器自动刷新（当静态文件和视图文件改变的时候）
gulp.task('sync', function() {
    browserSync.init({
        proxy: '127.0.0.1:' + conf.PORT
    });
    gulp.watch(myPath.frontendWatch).on('change', browserSync.reload);
});

// 默认任务
gulp.task('default', ['clean'], function() {
    gulp.start('minCSS', 'minJS', 'watch');
});


// 合并html文件中的link为一个并且返回{links: [], cssName: ""}
function doConcat() {


}
