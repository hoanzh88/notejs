var db = require("../common/database.js");

var conn = db.getConnection();

function getAllPost(){
	return new Promise (function(resole, reject){
        let sql = "SELECT posts.* FROM posts"
            let query = conn.query(sql, function(err, posts){
                if (err){
                    reject(err);
                }else{
                    resole(posts);
                }
            });
        });
}

module.exports = {
	getAllPost: getAllPost
}