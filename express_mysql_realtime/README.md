### Xây dựng ứng dụng thời gian thực với Nodejs express & mysql
Khởi tạo cơ bản & cài 1 số module cần thiết:
```
npm init
npm install express --save
npm install mysql --save
npm install body-parser --save
npm install express-session
npm install config
npm install ejs
npm install q
```

### Config
Tạo file \config\default.json
```
{
	"server":{
		"host":"0.0.0.0",
		"port":3000
	}
}
```

### Thử Hello World
```
var express = require("express");
var config = require("config");

var app = express();
app.get('/', function (req, res) {
   res.send('Hello World');
})

var host = config.get("server.host");
var port = config.get("server.port");

app.listen(port, host, function(){
	console.log("app is running on port", port);
});
```

### Config Static css, js, images
Tạo folder public (chứa css, images, js)
```
app.use("/static", express.static(__dirname+"/public"));
```

Test: tạo file css \public\css\main.css chạy thử
```
http://localhost:3000/static/css/main.css
```

### Tạo cấu trúc Mô hình MVC
Tạo folder apps (chứa controllers, models, views)

\app.js
```
var controller = require(__dirname+"/apps/controllers"); 
app.use(controller);
```

\apps\controllers\index.js
```
var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.json({"message":"this is home page"});
});

module.exports = router;
```

Test thử http://localhost:3000/

\apps\controllers\index.js
```
router.use("/admin", require(__dirname+"/admin.js"));
router.use("/blog", require(__dirname+"/blog.js"));
```

\apps\controllers\admin.js
```
var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.json({"message":"this is admin page"});
});

module.exports = router;
```

\apps\controllers\blog.js
```
var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.json({"message":"this is blog page"});
});

module.exports = router;
```

Test thử:
```
http://localhost:3000/admin
http://localhost:3000/blog
```

### Connect Mysql
Config Mysql
\config\default.json
```
"mysql":{
		"host": "localhost",
		"port": 3306,
		"database": "blog",
		"user": "root",
		"password": ""
	},
```

Tạo folder common để chứa các những file chung chung

\apps\common\database.js
```
var config = require("config");
var mysql = require("mysql");

const connection = mysql.createConnection({
	host: config.get("mysql.host"),
	user: config.get("mysql.user"),
	password: config.get("mysql.password"),
	database: config.get("mysql.database")
});

connection.connect(function(err){
	if (err){
		console.log(err);
		console.log("ket noi CSDL that bai");
	}else{
		console.log("ket noi CSDL thanh cong");
	}
});

function getConnection (){
	if(!connection){
		connection.connect();
	}
	return connection;
}

module.exports = {
	getConnection:getConnection
}
```

\apps\models\users.js
```
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
```

\apps\controllers\index.js
```
const user_model = require("../models/users");

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
```

Tạo table users & insert data để test
```
CREATE TABLE `users` (
  `id` INT(11) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) DEFAULT NULL,
  `last_name` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=latin1;
```

Test thử: http://localhost:3000/getallusers
