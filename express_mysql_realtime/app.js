var express = require("express");
var config = require("config");
var bodyParser = require("body-parser");
var session = require("express-session");

var socketio = require("socket.io");


var app = express();
app.use(bodyParser.urlencoded({ extended: true })); // true: support x-www-form-urlencoded
app.use(bodyParser.json());

// cau hinh session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set("views", __dirname+"/apps/views");
app.set("view engine", "ejs"); // cai dat ejs lam engine

// Static
app.use("/static", express.static(__dirname+"/public"));

var controller = require(__dirname+"/apps/controllers"); 
app.use(controller);

var host = config.get("server.host");
var port = config.get("server.port");

var server = app.listen(port, host, function(){
	console.log("app is running on port", port);
});

// var io = socketio(server);
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});

// const io = require('socket.io')(server, {
  // cors: {
    // origin: '*',
  // }
// });
var socketcontrol = require("./apps/common/socketcontrol.js")(io);
