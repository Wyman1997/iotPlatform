var express = require('express');
var router = express.Router();
var model = require("../model/index");
var mongoose = require('mongoose');

router.get("/",function(req, res, next){
    res.send('data');
})

//数据编辑
//req.body用来解析POST请求中的数据
router.post('/edit', function(req, res, next){
    var _id = mongoose.Types.ObjectId(req.body._id);
    var editOwner = req.body.owner;
    var page = req.body.page;
    model.connect(function(db){
        db.collection("sensordata").updateOne({_id: _id}, {$set:{
            owner:editOwner
        }}, function(err, ret){
            if(err){
                console.log("所有者修改失败");
            } else{
                console.log("所有者修改成功");
                res.redirect("/?page=" + page);
            }
        })
    })
  })








module.exports = router;