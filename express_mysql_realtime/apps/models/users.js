var db = require("../common/database.js");
var conn = db.getConnection();


function getAllUsers(){
    return new Promise (function(resole, reject){
            let query = conn.query('SELECT * FROM users', function(err, users){
                if (err){
                    reject(err);
                }else{
                    resole(users);
                }
            });
        });
}

const user_model = {};
user_model.getAllUsers = getAllUsers;

module.exports = user_model;