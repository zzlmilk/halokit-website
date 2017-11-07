﻿/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-01.
 * [项目启动文件]
 */

var app = require('../app'),
    conf = require('../conf/conf'),
    debug = require('debug')(conf.appName),
    http = require('http'),
    cluster = require('cluster'),
    numCpus = require('os').cpus().length,
    port = (function(_v) {
        var port = parseInt(_v, 10);
        if (isNaN(port)) {
            return _v;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    })(process.env.PORT || conf.PORT);

// 设置端口
app.set('port', port);

// 创建服务器
if (cluster.isMaster) {
    // 根据CPU数量创建进程
    var _l = numCpus;
    while (_l--) {
        cluster.fork();
    }
    cluster.on('listening', function(worker, address) {
        console.log('---worker: ' + worker.process.pid + ' start---');
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('---worker: ' + worker.process.pid + ' died,wait for restart…---');
        cluster.fork();
        console.log('---worker: ' + worker.process.pid + ' restart success---');
    });
} else {
    var server = http.createServer(app);
    server.listen(port);
    server.on('error', function(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    server.on('listening', function() {
        var addr = server.address(),
            bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });
}
