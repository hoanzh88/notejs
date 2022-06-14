var socket = require('socket.io'),
express = require('express'),
http = require('http'),

app = express(),
server = http.createServer( app ),
io = socket.listen( server );

io.sockets.on('connection', function(client){
   console.log('connection ');
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});