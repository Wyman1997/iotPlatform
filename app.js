var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var net = require('net');
var sensorDataModel = require("./model/sensordata");
var controllerDataModel = require("./model/controllerdata");
const mongoose = require('./model/db');
var model = require('./model/index');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');
const { Socket } = require('dgram');
const { mongo } = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session 的配置
app.use(session({
  secret: 'qf project',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 *5 }  //指定登录会话的有效时间
}))

//登录拦截
app.get("*", function(req, res, next){
  var username = req.session.username;
  var path = req.path;
  if(path != '/login' && path != '/regist'){
    if(!username){
      res.redirect('/login');
    }
  }
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//创建tcp server
var tcpServer = net.createServer();

//监听端口
tcpServer.listen(3306, function(){
  console.log("TCP Server Listening port 3306")
})

var socketArr = [];
var socketId = 1;


//处理客户端的连接
tcpServer.on('connection',function(socket){
  console.log("IP:" + socket.address().address + ' connect')
  socketArr[socketId] = socket;
  socketId++;
  dealSendCommand(socket);
  dealRecivedData(socket);
})

function dealSendCommand(socket){

}


function dealRecivedData(socket){
  socket.on("data", function(data){
    var receivedData = {
      CO2: '0',
      CH2O: '0',
      TVOC:'0',
      PM25: '0',
      PM10: '0',
      temperature:'0',
      humidty:'0',
      tcpClientIp:'0' ,
      receivedTime: '0',
      owner:'admin',
    }
    receivedData = JSON.parse(data);
    //优化：IP地址需重新解析
    receivedData.tcpClientIp = socket.address().address;
    receivedData.receivedTime =  Date.now();
    receivedData.owner = 'admin';
    console.log(receivedData);

    model.connect(function(db){
      db.collection('sensordata').insertOne(receivedData, function(err, doc){
        if(err){
          console.log('接收传感器数据失败');
        }else{
          console.log("接收传感器数据成功");
        }
      })
    })
  })

  socket.on('close', function(){
    console.log('client closed connection');
  })

  socket.on('error', function(err){
    console.log('client error');
  })

}


module.exports = app;
