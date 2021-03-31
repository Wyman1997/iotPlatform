const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/iot'

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(err){
    if(err){
        console.log("数据库连接失败", err);
    }else{
        console.log("数据库连接成功mongoose");
    }
})

module.exports = mongoose;