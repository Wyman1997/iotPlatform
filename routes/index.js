var express = require('express');
var router = express.Router();
var sensorDataModel = require("../model/sensordata");
var controllerDataModel = require("../model/controllerdata")
var model = require('../model/index');
var moment = require('moment');
var mongoose = require('mongoose');


async function findSensorData(username, pageSize, page){
  return new Promise((resolve,reject)=>{
    model.connect(function(db){
      db.collection("sensordata").find({owner:username}).sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2){
        if(err){
          console.log(err);
        }else{
          resolve(docs2);
        }
      })
    })
  })
}

/* GET home page. */
router.get('/',function(req, res, next) {
  var username = req.session.username;
  var page = req.query.page || 1;

  var data ={
    total: 0,   //总共有多少页
    curPage: page, 
    list: []    //当前页的数据
  }
  var pageSize = 10;

    //1.第一步查询所有的数据
  model.connect(function(db){
    db.collection('sensordata').find({owner:username}).toArray(async function(err, docs){
      data.total = Math.ceil(docs.length / pageSize);
        //2.查询当前页的数据
      var docs2 = await findSensorData(username, pageSize, page);
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
  var tcpClientIp = req.query.tcpClientIp;
  var item = {};

  model.connect(function(db){
    db.collection('sensordata').find({tcpClientIp: tcpClientIp}).toArray(function(err, docs){
      if(err){
        console.log("传感器数据查询失败")
      } else{
        item['tcpClientIp'] = tcpClientIp;
        item['page'] = page;
        res.render('edit',{username:username, item:item});
      }
    })
  })
})

router.get('/sendcmd', function(req, res, next){
  var username = req.session.username || '';
  res.render("sendcmd",{username:username});
})

module.exports = router;
