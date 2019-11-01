//数据库连接
var mysql = require("mysql");

//创建链接对象
var conn = mysql.createConnection({
    "host": "localhost",
    "port": "3306",
    "user": "mwc",
    "password":"",
    "database":"test"
});

conn.connect();

module.exports = conn;