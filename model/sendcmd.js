const { model } = require('mongoose');
const mongoose = require('./db');

var sendCmdScheam = mongoose.Schema({
    plasmaStatus:{
        type:Boolean
    },
    uvlStatus:{
        type:Boolean
    },
    speed:{

    },
    tcpClientIp:{
        
    },
    sendTime:{

    },
    flag:{        //用于判断数据是否发送
        
    },
})

//集合名称：sendcmd
var sendCmdModel = mongoose.model("Sendcmd",sendCmdScheam,"sendcmd");

module.exports = sendCmdModel;