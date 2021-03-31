var MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'iot'

function connect(callback){
    MongoClient.connect(url,function(err, client){
        if(err){
            console.log("数据库连接失败")
        }else{
            console.log("数据库连接成功mongo")
            var db = client.db(dbName)
            callback && callback(db)
            client.close()
        }
    })
}

module.exports = {
    connect
}