var express = require('express');
var router = express.Router();
var sensorDataModel = require("../model/sensordata");
var controllerDataModel = require("../model/controllerdata")
var model = require('../model/index');
var moment = require('moment');
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username;
  var page = req.query.page || 1;

  var data ={
    total: 0,   //总共有多少页
    curPage: page, 
    list: []    //当前页的数据
  }
  var pageSize = 10;

  model.connect(function(db){
    //1.第一步查询所有的文章
    db.collection('sensordata').find().toArray(function(err, docs){

      data.total = Math.ceil(docs.length / pageSize);
      //2.查询当前页的数据
      model.connect(function(db){
        db.collection("sensordata").find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2){
          if(docs2.length == 0){
            res.redirect('/?page=' + ((page-1) || 0));
          }else{
            docs2.map(function(ele, index){
              ele['time'] = moment(ele.receivedTime).format('YYYY-MM-DD HH:mm:ss');
            })
              data.list = docs2;
          }
          res.render('index', { username:username, data:data});
        });
      })

    })
  })
})

//渲染注册页
router.get("/regist", function(req, res, next){
  res.render('regist',{});
})

//渲染登录页
router.get("/login", function(req, res, next){
  res.render('login',{});
})

//数据删除
router.get('/delete', function(req, res, next){
  var _id = mongoose.Types.ObjectId(req.query._id);
  var page = req.query.page;

  model.connect(function(db){
      db.collection('sensordata').deleteOne({_id:_id}, function(err, ret){
          if(err){
              console.log("传感器数据删除失败");
          } else{
              console.log("传感器数据删除成功");
          }
          res.redirect('/?page=' + page);
      })
  })
})

//数据编辑页面
router.get('/edit', function(req, res, next){
  var username = req.session.username || '';
  var page = req.query.page;
  var _id = mongoose.Types.ObjectId(req.query._id);
  var item = {
    CO2: 0,
    CH2O: 0,
    TVOC: 0,
    PM25: 0,
    PM10: 0,
    temperature:0,
    humidty:0,
    tcpClientIp: 0,
    receivedTime: 0,
    owner: 0,
  }

  model.connect(function(db){
    db.collection('sensordata').findOne({_id: _id}, function(err, docs){
      if(err){
        console.log("传感器数据查询失败")
      } else{
        item = docs;
        item['page'] = page;
        res.render('edit',{username:username, item:item});
      }
    })
  })
})


module.exports = router;
