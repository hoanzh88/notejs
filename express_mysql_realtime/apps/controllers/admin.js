var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.json({"message":"this is admin page"});
});

// SIGNUP
router.get("/signup", function(req, res){
	res.render("signup.ejs", {data: {}});
});

module.exports = router;