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

function addUser(user){
     if(user){
        return new Promise (function(resole, reject){
            let query = conn.query('INSERT INTO users SET ?', user, function(err, results, fields){
                if (err){
                    reject(err);
                }else{
                    resole(results.insertId);
                }
            });
        });
     }else{
        return false
     }
}

const user_model = {};
user_model.getAllUsers = getAllUsers;
user_model.addUser = addUser;

module.exports = user_model;