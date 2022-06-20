var express = require("express");
var router = express.Router();

const user_model = require("../models/users");
router.use("/admin", require(__dirname+"/admin.js"));
router.use("/blog", require(__dirname+"/blog.js"));

router.get("/", function(req, res){
	// res.json({"message":"this is home page"});
	res.render("test"); // render file test.ejs sang html de tra ve client
});

router.get("/getallusers", function(req, res){
	let promise_user = user_model.getAllUsers();

	promise_user.then(function(users){
		res.json({
			"message":"this is list_user page",
			"users":users
		});
	}).catch(function(err){
		res.json({
			message: "Loi roi"
		});
	});
});

router.get("/chat", function(req, res){
	res.render("chat.ejs");
});


module.exports = router;