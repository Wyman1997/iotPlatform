const { model } = require('mongoose');
const mongoose = require('./db');

var controllerDataScheam = mongoose.Schema({
    plasma_status:{
        type:Boolean
    },
    uvl_status:{
        type:Boolean
    },
    tcp_client_ip:{

    },
    send_time:{

    },
})

//集合名称：controllerdata
var controllerDataModel = mongoose.model("Controllerdata",controllerDataScheam,"controllerdata");

module.exports = controllerDataModel;