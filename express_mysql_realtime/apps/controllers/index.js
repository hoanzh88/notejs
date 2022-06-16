var express = require("express");
var router = express.Router();

const user_model = require("../models/users");
router.use("/admin", require(__dirname+"/admin.js"));
router.use("/blog", require(__dirname+"/blog.js"));

router.get("/", function(req, res){
	res.json({"message":"this is home page"});
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

module.exports = router;