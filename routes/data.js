var express = require('express');
var router = express.Router();
var model = require("../model/index");
var mongoose = require('mongoose');
var sensorDataModel = require("../model/sensordata");
var controllerDataModel = require("../model/controllerdata");
var sendCmdModel = require("../model/sendcmd");
var em = require("../eventemitter");

router.get("/",function(req, res, next){
    res.send('data');
})


//数据编辑
//req.body用来解析POST请求中的数据
router.post('/edit', function(req, res, next){
    var tcpClientIp = req.body.tcpClientIp;
    var editOwner = req.body.owner;
    var page = req.body.page;
    sensorDataModel.updateMany({tcpClientIp: tcpClientIp},{$set:{
        owner:editOwner}},function(err, ret){
            if(err){
                console.log("所有者修改失败");
            } else{
                console.log("所有者修改成功");
                console.log(ret);
                res.redirect("/?page=" + page);
            }
    })
})

//数据发送
router.post("/send", function(req,res,next){

    var sendCmd = new sendCmdModel({
        plasmaStatus:req.body.plasmaStatus,
        uvlStatus:req.body.uvlStatus,
        speed:req.body.speed,
        tcpClientIp:req.body.tcpClientIp,
        sendTime:0,
        flag:"ready"
    })
    sendCmd.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("发送指令存储成功");
            em.emit('dataSend'); // 触发数据发送
            res.redirect('/sendcmd');
        }
    })
})



module.exports = router;