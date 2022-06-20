module.exports = function (io){
	
	var usernames = [];
	io.sockets.on("connection", function(socket){
		console.log("Have a new user connected");
		
		// LẮng nghe sự kiện addUser bên chat.ejs
		socket.on("addUser", function(username){
			// Lưu tên này lại
			socket.username = username;
			usernames.push(username);

			// notyfi myself và gửi lên chính nó 
			let data = {
				sender: "SERVER",
				message : "You have join chat room"
			};
			socket.emit("update_message", data);

			// Gửi thông báo tới toàn mọi người rằng người này đã join phòng chát
			data = {
				sender: "SERVER",
				message: username + " have join chat room"
			};
			socket.broadcast.emit("update_message", data)
		});
		
	});
}

