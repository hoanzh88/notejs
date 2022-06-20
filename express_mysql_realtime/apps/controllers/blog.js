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


router.get("/post/:id", function(req, res){
	let id = req.params.id;

	let data = post_md.getPostById(id);

	data.then(function(posts){
		let post = posts[0];

		let result = {
			post: post,
			error: false
		};
		res.render("blog/post.ejs", {data: result});
	}).catch(function(error){
		let result = {
			error: "Could not get post detail"
		};
		res.render("blog/post.ejs", {data: result});
	});
});

module.exports = router;