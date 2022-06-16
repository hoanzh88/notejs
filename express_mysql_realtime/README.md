### Xây dựng ứng dụng thời gian thực với Nodejs express & mysql & socketio
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

### Controllers
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

### Models
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

### Views
\app.js
```
app.set("views", __dirname+"/apps/views");
app.set("view engine", "ejs"); // cai dat ejs lam engine
```

\apps\controllers\index.js
```
router.get("/", function(req, res){
	// res.json({"message":"this is home page"});
	res.render("test"); // render file test.ejs sang html de tra ve client
});
```

\apps\views\test.ejs
```
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="/static/css/main.css">
</head>
<body>
	<h1> Welcome EJS engine </h1>
</body>
</html>
```

Test thử: http://localhost:3000/


### Form reigster
Tạo file \apps\views\signup.ejs
```
<!DOCTYPE html>
<html>
<head>
    <title>Sign Up</title>
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Latest compiled JavaScript -->
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
    <div class="container">
        <div id="signupbox" style="margin-top:50px" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <div class="panel-title">Sign Up</div>
                </div>
                <div class="panel-body" >
                    <form id="signupform" class="form-horizontal" role="form" method="POST" action="/admin/signup">

                        <div id="signupalert" style=" <% if (!data || !data.error){%> display:none <%}%>" class="alert alert-danger">
                            <p>Error:</p>

                            <% if (data && data.error) { %>
                            <span> <%= data.error %> </span>
                            <%}%>
                        </div>


                        <div class="form-group">
                            <label for="email" class="col-md-3 control-label">Email</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" name="email" placeholder="Email Address">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="col-md-3 control-label">Password</label>
                            <div class="col-md-9">
                                <input type="password" class="form-control" name="passwd" placeholder="Password">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="repassword" class="col-md-3 control-label">Re-Type</label>
                            <div class="col-md-9">
                                <input type="password" class="form-control" name="repasswd" placeholder="Re-Type Password">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="firstname" class="col-md-3 control-label">First Name</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" name="firstname" placeholder="First Name">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="lastname" class="col-md-3 control-label">Last Name</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" name="lastname" placeholder="Last Name">
                            </div>
                        </div>

                        <div class="form-group">
                            <!-- Button -->
                            <div class="col-md-offset-3 col-md-9">
                                <input id="btn-signup" type="submit" class="btn btn-info" value="Sign Up" />
                            </div>
                        </div>

                    </form>
                 </div>
            </div>

         </div>
    </div>

</body>
</html>
```

Thêm router signup \apps\controllers\admin.js
```
router.get("/signup", function(req, res){
	res.render("signup.ejs", {data: {}});
});
```

Test thử link: http://localhost:3000/admin/signup






