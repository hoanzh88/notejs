module.exports = function (io){	
	var usernames = [];
	// var post_md = require("../models/post.js");
	
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

			// Xử lý json respon
			// let data_post = post_md.getPostById(2);			
			// data_post.then(function(posts){
				// let post = posts[0];

				// let result = {
					// post: post,
					// error: false
				// };
				// socket.emit("update_message", result);
			// }).catch(function(error){
				
			// });
	
	
			// Gửi thông báo tới toàn mọi người rằng người này đã join phòng chát
			data = {
				sender: "SERVER",
				message: username + " have join chat room"
			};
			socket.broadcast.emit("update_message", data)
		});
		
		// Lắng nghe sự kiện user gửi message lên
		socket.on("send_message", function(message){

			// notify mysefl và gửi lên chính nó
			let data = {
				sender: "You",
				message: message
			};
			socket.emit("update_message", data);

			// Notify other user và gửi thông báo message cho các user khác
			data = {
				sender: socket.username,
				message: message
			};
			socket.broadcast.emit("update_message", data)
		});
		
		// Lắng nghe sự kiện user disconnect
		socket.on("disconnect", function(){

			// Xóa cái user vừa disconnect này đi
			for (let i = 0; i < usernames.length;i++ ){
				if (usernames[i] == socket.username ){
					usernames.splice(i, 1);
				}
			}

			// Thông báo tới mọi người user này vừa thoát
			let data = {
				sender: "SERVER",
				message: socket.username + " have leave chat room"
			};
			socket.broadcast.emit("update_message", data);
		});
		
	});
}

