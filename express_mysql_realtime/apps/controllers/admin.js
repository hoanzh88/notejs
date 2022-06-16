var express = require("express");
var router = express.Router();

const user_model = require("../models/users");

var helper = require("../helpers/helper.js");

router.get("/", function(req, res){
	res.json({"message":"this is admin page"});
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

module.exports = router;