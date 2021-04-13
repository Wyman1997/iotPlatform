const { model } = require('mongoose');
const mongoose = require('./db');

var controllerDataScheam = mongoose.Schema({
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
    receivedTime:{

    },
})

//集合名称：controllerdata
var controllerDataModel = mongoose.model("Controllerdata",controllerDataScheam,"controllerdata");

module.exports = controllerDataModel;