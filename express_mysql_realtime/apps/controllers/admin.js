var express = require("express");
var router = express.Router();

const user_model = require("../models/users");
var post_md = require("../models/post.js");
var helper = require("../helpers/helper.js");

router.get("/", function(req, res){
	if (req.session.user){
		var data = post_md.getAllPost();
		data.then(function(posts){
			let data = {
				posts: posts,
				error: false
			}

			// Render trang dashboard và show danh sách bài viêt ra
			res.render("admin/dashboard.ejs", {data: data});
		}).catch(function(error){
			res.render("admin/dashboard.ejs", {data: {error: "Get posts data is error"}});
		});
	}else{
		res.redirect("/admin/signin")
	}	
});


// SIGNUP
router.get("/signup", function(req, res){
	res.render("signup.ejs", {data: {}});
});

router.post("/signup", function(req, res){
	var user = req.body;

	if (user.email.trim().length == 0){
		res.render("signup.ejs", {data: {error: "Email is require"}});
	}

	if (user.passwd != user.repasswd && user.passwd.trim().length != 0){
		res.render("signup.ejs", {data: {error: "password is not match"}});		
	}

	// insert to DB
	var password = helper.hash_password(user.passwd);
	
	user = {
		email: user.email,
		password: password, 
		first_name: user.firstname,
		last_name: user.lastname
	};

	let results = user_model.addUser(user);

	results.then(function(data){
		res.redirect("/admin/signin");
	}).catch(function(err){
		res.render("signup.ejs", {data: {error: "could not insert to DB"}});
	});

});

// SIGNIN
router.get("/signin", function(req, res){
	res.render("signin.ejs", {data: {}});
});

router.post("/signin", function(req, res){
	var params = req.body; // lấy data từ form

	if (params.email.trim().length == 0){
		res.render("signin.ejs", {data: {error: "Please enter email"}});
	}else{
		var data = user_model.getUserByEmail(params.email);

		if (data){
			data.then(function(users){
				let user = users[0];				
				// So sánh password được lấy từ view với password được lưu trong DB
				let status = helper.compare_password(params.password, user.password);
				console.log(status);
				if(!status){
					res.render("signin.ejs", {data: {error: "password is incorrect"}});
				}else{
					req.session.user = user;
					console.log(req.session.user);
					res.redirect("/admin");
				}
			});

		}else{
			res.render("signin.ejs", {data: {error: "Email not exists"}});
		}
	}
});

// DASHBOARD
router.get("/post", function(req, res){
	if (req.session.user){
		res.redirect("/admin");
	}else{
		res.redirect("/admin/signin");
	}
});

// ADD NEW POST
router.get("/post/new", function(req, res){
	if (req.session.user){
		res.render("admin/post/new.ejs", {data: {error: false}});
	}else{
		res.redirect("/admin/signin")
	}
	
});

router.post("/post/new", function(req,res){
	var params = req.body;
	
	if (params.title.trim().length == 0){
		let data = {
			error: "Please enter the title of new post"
		}
		res.render("admin/post/new.ejs", {data: data});

	}else{
		params.created_at = new Date();
	 	params.updated_at = new Date();
		let data = post_md.addPost(params);

		data.then(function(data){
			res.redirect("/admin");
		}).catch(function(err){
			let data = {
				error: false
			};
			res.render("admin/post/new.ejs", {data: data});
		});
	}	 
});

// Edit post form
router.get("/post/edit/:id", function(req, res){
	if (req.session.user){
		let id = req.params.id; // Params
		// let id = req.query.id; // Query

		let data_db = post_md.getPostById(id);

		data_db.then(function(posts){
			let post = posts[0];

			let data_view_edit = {
				post: post,
				error: false
			};

			res.render("admin/post/edit", {data_view_edit: data_view_edit});
		}).catch(function(err){
			let data_view_edit = {
				error: "Could not get post data with id = " + id
			};

			res.render("admin/post/edit", {data_view_edit: data_view_edit});
		});
	}else{
		res.redirect("/admin/signin")
	}	
});
router.put("/post/edit", function(req, res){
	let params = req.body;

	let data_db = post_md.updatePost(params);
	if(!data_db){
		res.json({
			code: 500,
			message: "Error DB"
		});
	}else{
		data_db.then(function(results){
			res.json({
				code: 200,
				message: "success"
			});
		}).catch(function(error){
			res.json({
				code: 500,
				message: "Error DB 2"
			});
		});
	}
});

router.delete("/post/delete", function(req, res){
	let id = req.body.id;

	let data_db = post_md.deletePost(id);

	if(!data_db){
		res.json({
			code: 500,
			message: "Error DB"
		});
	}else{
		data_db.then(function(results){
			res.json({
				code: 200,
				message: "delete success"
			});
		}).catch(function(error){
			res.json({
				code: 500,
				message: "Error DB 2"
			});
		});
	}
});

// USER
router.get("/users", function(req, res){
	if (req.session.user){
		let data = user_model.getAllUsers();
		data.then(function(users){
			let data = {
				users: users,
				error: false
			}
			res.render("admin/users.ejs", {data: data});
		}).catch(function(error){
			let data = {
				error: "could not get user info"
			}
			res.render("admin/users.ejs", {data: data});
		});
	}else{
		res.redirect("/admin/signin")
	}
	

});

module.exports = router;