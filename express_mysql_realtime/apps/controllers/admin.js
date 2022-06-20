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



module.exports = router;