var express = require("express");
var config = require("config");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: false })); // true: support x-www-form-urlencoded
app.use(bodyParser.json());

// Static
app.use("/static", express.static(__dirname+"/public"));

var controller = require(__dirname+"/apps/controllers"); 
app.use(controller);

var host = config.get("server.host");
var port = config.get("server.port");

app.listen(port, host, function(){
	console.log("app is running on port", port);
});