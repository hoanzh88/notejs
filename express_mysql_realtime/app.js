var express = require("express");
var config = require("config");

var app = express();
// app.get('/', function (req, res) {
   // res.send('Hello World');
// })

// Static
app.use("/static", express.static(__dirname+"/public"));

var host = config.get("server.host");
var port = config.get("server.port");

app.listen(port, host, function(){
	console.log("app is running on port", port);
});