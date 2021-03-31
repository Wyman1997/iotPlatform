var express = require('express');
var router = express.Router();
var usersModel = require('../model/users');
var session = require('express-session')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册接口
router.post('/regist', function(req, res, next){
  var data = new usersModel({
    username:req.body.username,
    password:req.body.password,
    date:Date.now().toString()
  });

  data.save(function(err){
    if(err){
      console("注册失败");
      res.redirect("/regist");
    }else{
      console.log("注册成功");
      res.redirect("/login");
    }
  })
})

//登录接口
router.post("/login", function(req, res, next){
  var data = {
    username: req.body.username,
    password: req.body.password
  }
  usersModel.find(data,function(err, docs){
    if(err){
      res.redirect("/login");
    }else{
      if(docs.length > 0){
        req.session.username = data.username;
        res.redirect('/');
      }else{
        res.redirect('/login');
      }
    }
  
  })
})

//退出登录
router.get('/logout', function(req, res, next){
  req.session.username = undefined;
  res.redirect('/login');
})


module.exports = router;
