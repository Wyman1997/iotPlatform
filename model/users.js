const mongoose = require('./db');

var usersScheam = mongoose.Schema({
    username:{
        type:String,
        trim:true,
        require:true
    },
    password:{
        type:String
    },
    date:{
        type:String
    }
})

var usersModel = mongoose.model("Users",usersScheam, "users");

module.exports = usersModel;