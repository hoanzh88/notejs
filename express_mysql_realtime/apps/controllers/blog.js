var express = require("express");
var router = express.Router();

var post_md = require("../models/post.js");

router.get("/", function(req, res){
	//res.json({"message":"this is blog page"});

	let data = post_md.getAllPost();
	data.then(function(posts){
		console.log("===> ", posts)
		let data = {
			posts: posts,
			error: false
		}
		res.render("blog/index.ejs", {data:data});
	}).catch(function(error){
		console.log(error);
		let data = {
			error: "could get post data"
		}
		res.render("blog/index.ejs", {data:data});
	});
});

module.exports = router;