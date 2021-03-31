const { model } = require('mongoose');
const mongoose = require('./db');

var sensorDataScheam = mongoose.Schema({
    CO2:{
        type:String
    },
    CH2O:{
        type:String
    },
    TVOC:{
        type:String
    },
    PM25:{
        type:String
    },
    PM10:{
        type:String
    },
    temperature:{
        type:String
    },
    humidty:{
        type:String
    },
    tcpClientIp:{
        
    },
    receivedTime:{

    },
    owner:{
        type:String
    }
})

var sensorDataModel = mongoose.model("Sensordata",sensorDataScheam,"sensordata");

module.exports = sensorDataModel;