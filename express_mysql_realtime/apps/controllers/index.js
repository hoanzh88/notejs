var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.json({"message":"this is home page"});
});

module.exports = router;