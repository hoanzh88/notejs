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


function addPost(params){
	if(params){
        return new Promise (function(resole, reject){
            let query = conn.query('INSERT INTO posts SET ?', params, function(err, results, fields){
                if (err){
                    reject(err);
                }else{
                    resole(results);
                }
            });
        });
     }else{
        return false
     }
}


function getPostById(id){
	return new Promise (function(resole, reject){
            let query = conn.query('SELECT * FROM posts WHERE ?', {id: id}, function(err, posts){
                if (err){
                    reject(err);
                }else{
                    resole(posts);
                }
            });
        });	
}

function updatePost(params){
	if(params){
        return new Promise (function(resole, reject){
            let query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?', 
            	[params.title, params.content, params.author, new Date(), params.id], function(err, results, fields){
                if (err){
                    reject(err);
                }else{
                    resole(results);
                }
            });
        });
     }else{
        return false
     }
}

module.exports = {
	getAllPost: getAllPost,
	addPost: addPost,
	getPostById: getPostById,
	updatePost: updatePost
}