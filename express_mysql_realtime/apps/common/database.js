var config = require("config");
var mysql = require("mysql");

const connection = mysql.createConnection({
	host: config.get("mysql.host"),
	user: config.get("mysql.user"),
	password: config.get("mysql.password"),
	database: config.get("mysql.database")
});

connection.connect(function(err){
	if (err){
		console.log(err);
		console.log("ket noi CSDL that bai");
	}else{
		console.log("ket noi CSDL thanh cong");
	}
});

function getConnection (){
	if(!connection){
		connection.connect();
	}
	return connection;
}

module.exports = {
	getConnection:getConnection
}