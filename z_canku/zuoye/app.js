
/**
 * Module dependencies.
 */
//'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var config = require('./global').config;

var app = express();
var MemStore = express.session.MemoryStore;

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.logger('dev'));//记录操作日志或错误日志 这里用了dev格式名
  app.use(express.compress());//压缩响应数据流 在其他响应件前使用 保证响应流都被压缩
  app.use(express.bodyParser());//解析客户端请求中的body内容
  app.use(express.methodOverride());//结合bodyParser一起使用，为其提供http方法支持。
  app.use(express.cookieParser());//用于获取浏览器发送的cookies值
  app.use(express.session({
    secret: config.session_secret, 
    store: MemStore({
      reapInterval: 60000 * 10
    })
  }));                        //为用户提供一个session管理器 保存数据 session是保存在一个cookies
  app.use(express.static(path.join(__dirname, 'public')));//使客户端直接访问所有静态文件
});

//app.dynamicHelpers
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});
app.use(app.router);

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
