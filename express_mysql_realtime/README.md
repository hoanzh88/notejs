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

\app.js
sửa false thành true để lấy data từ form được
```
app.use(bodyParser.urlencoded({ extended: true }));
```

apps\controllers\admin.js
```
const user_model = require("../models/users");
router.post("/signup", function(req, res){
	var user = req.body;

	if (user.email.trim().length == 0){
		res.render("signup.ejs", {data: {error: "Email is require"}});
	}

	if (user.passwd != user.repasswd && user.passwd.trim().length != 0){
		res.render("signup.ejs", {data: {error: "password is not match"}});		
	}

	// insert to DB

});
```
Test thử link: http://localhost:3000/admin/signup

apps\controllers\admin.js
```
	// insert to DB
	user = {
		email: user.email,
		password: user.passwd, // cần mã hóa mật khẩu
		first_name: user.firstname,
		last_name: user.lastname
	};

	let results = user_model.addUser(user);

	results.then(function(data){
		res.redirect("/admin/signin");
	}).catch(function(err){
		res.render("signup.ejs", {data: {error: "could not insert to DB"}});
	});
```

\apps\models\users.js
```
function addUser (user){
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

user_model.addUser = addUser;
```

Test insert thử link: http://localhost:3000/admin/signup

### Mã hóa password
Cài: 
npm install bcrypt -save
npm install bcryptjs -save

\config\default.json
```
	"salt": 10,
	"secret_key": "secretkey"
```

tạo folder helpers cho các hàm dùng chung
\apps\helpers\helper.js
```
var bcrypt = require ("bcryptjs");
var config = require("config");

function hash_password (password){
	var saltRounds = config.get("salt");

	// generale ra một cái key để lưu pass
	var salt = bcrypt.genSaltSync(saltRounds);

	// Mã hóa pass thành hash bởi 1 cái key có độ dài là 10
	var hash = bcrypt.hashSync(password, salt);

	return hash;
}

module.exports = {
	hash_password: hash_password
}
```
Sửa lại phần passwd trong apps\controllers\admin.js
```
var helper = require("../helpers/helper.js");

var password = helper.hash_password(user.passwd);
user = {
		email: user.email,
		password: password, 
		first_name: user.firstname,
		last_name: user.lastname
	};
```

### Login Form
\apps\views\signin.ejs
```
<!DOCTYPE html>
<html>
<head>
	<title> sign in</title>
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

    <!-- Latest compiled JavaScript -->
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
  	<div class="container">    
        <div class="text-center">
            <a href="http://gioithieu.sachmem.vn"></a>
            <img style="margin-top:25px;box-shadow:2px 2px 2px grey;" src="https://www.sachmem.vn/assets/logo-small-522675a1aeaa79606cfbdf29142c86b0c337d5a958be22cbc6a6eb7718d7d28b.png"/>
            </a>        
        </div>
    
        <div id="loginbox" style="margin-top:25px;" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">                    
            <div class="panel panel-info" >
                <div class="panel-heading">
                    <div class="panel-title">Đăng nhập</div>
                        

                <div style="padding-top:30px" class="panel-body" >

                	<% if (data && data.error ) {%>

                    <div id="login-alert" class="alert alert-danger col-sm-12">
                    	<%= data.error %>
                    </div>

                    <% } %> 
                        
                    <form id="loginform" class="form-horizontal" role="form" method="POST" action="">
                                
                        <div style="margin-bottom: 25px" class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                            <input id="login-email" type="text" class="form-control" name="email" value="" placeholder="email">                                        
                        </div>
                            
                        <div style="margin-bottom: 25px" class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            <input id="login-password" type="password" class="form-control" name="password" placeholder="mật khẩu">
                        </div>
                                

                        <div style="margin-top:10px" class="form-group">
                            <!-- Button -->

                            <div class="col-sm-12 controls">
                              <input id="btn-login" type="submit" class="btn btn-success" value="login">
                            </div>
                        </div>


                        <div class="form-group">
                            <div class="col-md-12 control">
                                <div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
                                    Nếu bạn chưa có tài khoản 
                                	<a href="signup">
                                    Đăng ký</a>
                                    hoặc <a id="btn-fblogin" href="#" class="btn btn-primary">Đăng nhập bằng Facebook</a>

                                </div>
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

\apps\controllers\admin.js
```
router.get("/signin", function(req, res){
	res.render("signin.ejs", {data: {}});
});
```

Test thử http://localhost:3000/admin/signin
Config express-session
\app.js
```
var session = require("express-session");

// cau hinh session sau bodyParser
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
```

\apps\controllers\admin.js
```
router.post("/signin", function(req, res){
	var params = req.body; // lấy data từ form bắn lên từ views

	// Nếu không nhập email thì báo lỗi
	if (params.email.trim().length == 0){
		res.render("signin.ejs", {data: {error: "Please enter email"}});

	// Nếu có email rồi thì chuyền email này vào model để lấy toàn bộ thông tin user trong DB
	// sau đó so sánh password mới nhập với password được lưu trong DB. nếu khớp thì ok.
	}else{
		var data = user_md.getUserByEmail(params.email); // Hàm lấy thông tin user ra bằng email

		if (data){
			data.then(function(users){
				let user = users[0];
				
				// So sánh password được lấy từ view với password được lưu trong DB
				let status = helper.compare_password(params.password, user.password);
				console.log(status);
				if(!status){
					res.render("signin.ejs", {data: {error: "password is incorrect"}});
				}else{
					req.session.user = user;
					console.log(req.session.user);
					res.redirect("/admin");
				}
			});

		}else{
			res.render("signin.ejs", {data: {error: "Email not exists"}});
		}
	}
});
```

\apps\models\users.js
```
function getUserByEmail(email){
    if (email){
        return new Promise (function(resole, reject){
            let query = conn.query('SELECT * FROM users WHERE ?', {email: email}, function(err, results, fields){
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

user_model.getUserByEmail = getUserByEmail;
```

\apps\helpers\helper.js
```
function compare_password(password, hash){
	// return true
	bcrypt.compareSync(password, hash); // return true neu hash chua password, va return false neu khong chua password
}

compare_password: compare_password
```

Test thử login http://localhost:3000/admin/signin

### posts

Tạo table posts
```
CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` mediumtext,
  `author` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

Dùng router index của admin là trang dashboard
\apps\controllers\admin.js
```
router.get("/", function(req, res){
	if (req.session.user){
			res.render("admin/dashboard.ejs", {data: {}});	
	}else{
		res.redirect("/admin/signin")
	}	
});
```

\apps\views\admin\dashboard.ejs
```
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<%- include('layout/head.ejs') %>
</head>
<body>
	<%- include('layout/nav.ejs') %>
	<div class="row" style="margin-bottom: 10px">
		<div class="col-md-12">
			<a href="/admin/post/new" class="btn btn-success pull-right">Add new Post</a>
		</div>
	</div>

	<div class="panel panel-default">
	    <div class="panel-heading">
	        Post
	    </div>
	    <!-- /.panel-heading -->
	    <div class="panel-body">
	        <div class="table-responsive">
	            <table class="table table-striped table-bordered table-hover">
	                <thead>
	                    <tr>
	                        <th>ID</th>
	                        <th>Title</th>
	                        <th>Content</th>
	                        <th>Author</th>
	                        <th>Created Time</th>
                    		<th>Updated Time</th>
                    		<th>Action</th>
	                    </tr>
	                </thead>
	                <tbody>

	                </tbody>
	            </table>
	        </div>
	        <!-- /.table-responsive -->
	    </div>
	    <!-- /.panel-body -->
	</div>

</body>
</html>
```

\apps\views\admin\layout\head.ejs
```
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
```

\apps\views\admin\layout\nav.ejs
```
<nav class="navbar navbar-default">
	<div class="container-fluid">
		<div class="navbar-header">
	  		<a class="navbar-brand" href="/admin">Blog Admin</a>
		</div>
		<ul class="nav navbar-nav">
			<li class="blog"><a href="http://localhost:3000/blog">Blog</a></li>
		 	<li class="active"><a href="admin/post">Posts</a></li>
		  	<li><a href="admin/users">User</a></li>
		</ul>
	</div>
</nav>
```

Chạy test thử: http://localhost:3000/admin

Model post
\apps\models\post.js
```
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
```

\apps\controllers\admin.js
```
var post_md = require("../models/post.js");

router.get("/", function(req, res){
	if (req.session.user){
		var data = post_md.getAllPost();
		data.then(function(posts){
			let data = {
				posts: posts,
				error: false
			}

			// Render trang dashboard và show danh sách bài viêt ra
			res.render("admin/dashboard.ejs", {data: data});
		}).catch(function(error){
			res.render("admin/dashboard.ejs", {data: {error: "Get posts data is error"}});
		});
	}else{
		res.redirect("/admin/signin")
	}	
});
```

\apps\views\admin\dashboard.ejs
```
<tbody>
	<% if (data && data.posts){
			for (var i =0; i < data.posts.length; i++){
	%>
				<tr>
					<td> <%= data.posts[i].id %></td>
					<td> <%= data.posts[i].title%></td>
					<td> <%= data.posts[i].content%></td>
					<td> <%= data.posts[i].author%></td>

					<td> <%= data.posts[i].created_at%> </td>
					<td> <%= data.posts[i].updated_at%></td>
					<td> 
						<a href="/admin/post/edit/<%= data.posts[i].id %>" class="btn btn-primary"> Edit</a>
						<button class="btn btn-danger delete_post" id="<%= data.posts[i].id %>">Delete</button>
					</td>
				</tr>
	<%
			}
		}
	%>
</tbody>
```

### Chức năng add new post
\apps\controllers\admin.js
```
router.get("/post/new", function(req, res){
	if (req.session.user){
		res.render("admin/post/new.ejs", {data: {error: false}});
	}else{
		res.redirect("/admin/signin")
	}
	
});
```

\apps\views\admin\post\new.ejs
```
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<%- include('../layout/head.ejs') %>
	<script src="https://cloud.tinymce.com/stable/tinymce.min.js"></script>
  	<script>tinymce.init({ selector:'textarea' });</script>
</head>
<body>
	<div class="container">
		<%- include('../layout/nav.ejs') %>
		<div class="panel panel-default">
            <div class="panel-heading">
                Add new Post
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-lg-6">

                    	<% if (data && data.error ) {%>
	           			 	<div id="login-alert" class="alert alert-danger col-sm-12">
	                    		<%= data.error %>
	                		</div>
                    	<% } %> 

                        <form role="form" method="POST" action="/admin/post/new">
                            <div class="form-group">
                                <label>Title</label>
                                <input class="form-control" name="title" placeholder="Title">
                            </div>
                            <div class="form-group">
                                <label>Content</label>
                                <textarea class="form-control" name="content" placeholder="Content"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Author</label>
                                <input class="form-control" name="author" placeholder="Author">
                            </div>
                            <input type="submit" name="" value="add" class="btn btn-success">
                        </form>
                    </div>
                    <!-- /.col-lg-6 (nested) -->
                </div>
                <!-- /.row (nested) -->
            </div>
            <!-- /.panel-body -->
        </div>
	</div>
</body>
</html>
```
--> Chạy xem form html

\apps\controllers\admin.js
```
router.post("/post/new", function(req,res){
	var params = req.body;
	
	if (params.title.trim().length == 0){
		let data = {
			error: "Please enter the title of new post"
		}
		res.render("admin/post/new.ejs", {data: data});

	}else{
		params.created_at = new Date();
	 	params.updated_at = new Date();
		let data = post_md.addPost(params);

		data.then(function(data){
			res.redirect("/admin");
		}).catch(function(err){
			let data = {
				error: false
			};
			res.render("admin/post/new.ejs", {data: data});
		});
	}	 
});
```

\apps\models\post.js
```
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

addPost: addPost,
```
--> Chạy test insert xem có vào database

### Chức năng edit post
apps\controllers\admin.js
```
// Edit post form
router.get("/post/edit/:id", function(req, res){
	if (req.session.user){
		let id = req.params.id; // Params
		// let id = req.query.id; // Query

		let data_db = post_md.getPostById(id);

		data_db.then(function(posts){
			let post = posts[0];

			let data_view_edit = {
				post: post,
				error: false
			};

			res.render("admin/post/edit", {data_view_edit: data_view_edit});
		}).catch(function(err){
			let data_view_edit = {
				error: "Could not get post data with id = " + id
			};

			res.render("admin/post/edit", {data_view_edit: data_view_edit});
		});
	}else{
		res.redirect("/admin/signin")
	}	
});
```

\apps\models\post.js
```
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

getPostById: getPostById,
```

apps\views\admin\post\edit.ejs
```

```
Dùng ajax để tạo put method
\public\js\post.js
```
function bindEvents(){
	$(".btn_update").click(function(){

		var id = $(".id_cl").val();
		var title = $(".title_cl").val();
		var content = tinymce.get("content").getContent();
		var author = $(".author_cl").val();

		var body = {
			id: id,
			title: title,
			content: content,
			author: author
		};
		
		var base_url = location.protocol + "//" + document.domain + ":" + location.port;
		var url_update = base_url + "/admin/post/edit" 
		$.ajax({
			url: url_update,
			type: "PUT",
			data: body,
			dataType: "json",
			success: function(res){
				console.log(res);
				if(res.code == 200){
					location.reload();
				}else{
					alert("Loi, fucking bug");
				}
			}
		});
	});
}

$(document).ready(function(){
	bindEvents();
});

```

apps\controllers\admin.js
```
router.put("/post/edit", function(req, res){
	let params = req.body;

	let data_db = post_md.updatePost(params);
	if(!data_db){
		res.json({
			code: 500,
			message: "Error DB"
		});
	}else{
		data_db.then(function(results){
			res.json({
				code: 200,
				message: "success"
			});
		}).catch(function(error){
			res.json({
				code: 500,
				message: "Error DB 2"
			});
		});
	}
});
```

apps\models\post.js
```
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

updatePost: updatePost,
```

Chạy test update thử


### Delete post
\apps\controllers\admin.js
```
router.delete("/post/delete", function(req, res){
	let id = req.body.id;

	let data_db = post_md.deletePost(id);

	if(!data_db){
		res.json({
			code: 500,
			message: "Error DB"
		});
	}else{
		data_db.then(function(results){
			res.json({
				code: 200,
				message: "delete success"
			});
		}).catch(function(error){
			res.json({
				code: 500,
				message: "Error DB 2"
			});
		});
	}
});
```

apps\models\post.js
```
function deletePost(id){
	if (id){
		return new Promise (function(resole, reject){
            let query = conn.query('DELETE FROM posts WHERE id=?', [id], function(err, results, fields){
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

deletePost: deletePost
```

\public\js\post.js
```
	$(".delete_post").click(function(){
		var post_id = $(this).attr("id");

		var body= {
			id: post_id
		}

		var base_url = location.protocol + "//" + document.domain + ":" + location.port;
		var url_delete = base_url + "/admin/post/delete"

		$.ajax({
			url: url_delete,
			type: "DELETE",
			data: body,
			dataType: "json",
			success: function(res){
				console.log(res);
				if (res.code == 200){
					location.reload();
				}else{
					alert("loi, fucking bug");
				}
			}
		});
	});
```

Chạy test delete xem kết quả

### Menu User
apps\controllers\admin.js
```
// USER
router.get("/users", function(req, res){
	if (req.session.user){
		let data = user_model.getAllUsers();
		data.then(function(users){
			let data = {
				users: users,
				error: false
			}
			res.render("admin/users.ejs", {data: data});
		}).catch(function(error){
			let data = {
				error: "could not get user info"
			}
			res.render("admin/users.ejs", {data: data});
		});
	}else{
		res.redirect("/admin/signin")
	}
	

});
```

apps\views\admin\users.ejs
```
<!DOCTYPE html>
<html>
<head>
	<title></title>

	<%- include('layout/head.ejs') %>
</head>
<body>
	<%- include('layout/nav.ejs') %>

	<div class="panel panel-default">
	    <div class="panel-heading">
	        Users
	    </div>
	    <!-- /.panel-heading -->
	    <div class="panel-body">
	        <div class="table-responsive">
	            <table class="table table-striped table-bordered table-hover">
	                <thead>
	                    <tr>
	                        <th>ID</th>
	                        <th>Email</th>
	                        <th>First Name</th>
	                        <th>Last Name</th>
	                        <th>Created Time</th>
                    		<th>Updated Time</th>
	                    </tr>
	                </thead>
	                <tbody>
	                    <% if (data && data.users){
	                    		for (var i =0; i < data.users.length; i++){
                		%>
                					<tr>
                						<td> <%= data.users[i].id %></td>
                						<td> <%= data.users[i].email%></td>
                						<td> <%= data.users[i].first_name%></td>
                						<td> <%= data.users[i].last_name%></td>
                						<td> <%= data.users[i].created_at%> </td>
                						<td> <%= data.users[i].updated_at%></td>
                					</tr>
    					<%
	                    		}
	                    	}
	                    %>

	                </tbody>
	            </table>
	        </div>
	        <!-- /.table-responsive -->
	    </div>
	    <!-- /.panel-body -->
	</div>

</body>
</html>
```

Chạy xem kết quả trang user

### Blog Page

apps\controllers\blog.js
```
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
```

apps\views\blog\index.ejs
```
<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Tech Blog</title>

    <!-- Bootstrap core CSS -->
    <link href="/static/theme/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom fonts for this template -->
    <link href="/static/theme/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

    <!-- Custom styles for this template -->
    <link href="/static/theme/css/clean-blog.min.css" rel="stylesheet">

  </head>

  <body>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
      <div class="container">
        <a class="navbar-brand" href="/blog">Blog</a>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i class="fa fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="/blog">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/blog/about">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="contact.html">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Header -->
    <header class="masthead" style="background-image: url('/static/theme/img/home-bg.jpg')">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <div class="site-heading">
              <h1>Tech Blog</h1>
              <span class="subheading">The most technology for you</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <% if (data && data.posts ) {%>
            <% for (var i= 0; i < data.posts.length; i++) {%>
              <div class="post-preview">
                <a href="/blog/post/ <%= data.posts[i].id%>">
                  <h2 class="post-title">
                    <%= data.posts[i].title%>
                  </h2>
                  <h3 class="post-subtitle">
                    <%- data.posts[i].content%>
                  </h3>
                </a>
                <p class="post-meta">Posted by
                  <a href="#"><%= data.posts[i].author%></a>
                  on <%= data.posts[i].created_at%></p>
              </div>
            <%}%>
          <%}%>
          <hr>
          
          <!-- Pager -->
          <div class="clearfix">
            <a class="btn btn-primary float-right" href="#">Older Posts &rarr;</a>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <ul class="list-inline text-center">
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
            </ul>
            <p class="copyright text-muted">Copyright &copy; Tech Blog 2018</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Bootstrap core JavaScript -->
    <script src="/static/theme/vendor/jquery/jquery.min.js"></script>
    <script src="/static/theme/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Custom scripts for this template -->
    <script src="/static/theme/js/clean-blog.min.js"></script>

  </body>

</html>
```

Folder bootstrap
\public\theme

Chạy thử xem kết quả: http://localhost:3000/blog

### Detail blog
apps\controllers\blog.js
```
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
```

apps\views\blog\post.ejs
```
<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title> <% if (data && data.post ) { %> <%= data.post.title%> <%}%> </title>

    <!-- Bootstrap core CSS -->
    <link href="/static/theme/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom fonts for this template -->
    <link href="/static/theme/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

    <!-- Custom styles for this template -->
    <link href="static/theme/css/clean-blog.min.css" rel="stylesheet">

  </head>

  <body>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
      <div class="container">
        <a class="navbar-brand" href="/blog">Tech Blog</a>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i class="fa fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="/blog">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/blog/about">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="contact.html">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Header -->
    <header class="masthead" style="background-image: url('/static/theme/img/post-bg.jpg')">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">

            <% if (data && data.post) {%> 
            <div class="post-heading">
              <h1> <%= data.post.title %> </h1>
              <!-- <h2 class="subheading">Problems look mighty small from 150 miles up</h2> -->
              <span class="meta">Posted by
                <a href="#"> <%= data.post.author %> </a>
                on <%= data.post.created_at %> </span>
            </div>
            <%}%>
          </div>
        </div>
      </div>
    </header>

    <!-- Post Content -->
    <article>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            
            <%- data.post.content%>
            
          </div>
        </div>
      </div>
    </article>

    <hr>

    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <ul class="list-inline text-center">
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
            </ul>
            <p class="copyright text-muted">Copyright &copy; Tech Blog 2018</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Bootstrap core JavaScript -->
    <script src="/static/theme/vendor/jquery/jquery.min.js"></script>
    <script src="/static/theme/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Custom scripts for this template -->
    <script src="/static/theme/js/clean-blog.min.js"></script>

  </body>

</html>
```

### about page
apps\controllers\blog.js
```
router.get("/about", function(req, res){
	res.render("blog/about.ejs");
});
```

apps\views\blog\about.ejs
```
<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Tech Blog - About</title>

    <!-- Bootstrap core CSS -->
    <link href="/static/theme/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom fonts for this template -->
    <link href="/static/theme/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

    <!-- Custom styles for this template -->
    <link href="/static/theme/css/clean-blog.min.css" rel="stylesheet">

  </head>

  <body>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
      <div class="container">
        <a class="navbar-brand" href="/blog">Tech Blog</a>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i class="fa fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="/blog">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/blog/about">About</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Header -->
    <header class="masthead" style="background-image: url('/static/theme/img/about-bg.jpg')">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <div class="page-heading">
              <h1>About Me</h1>
              <span class="subheading">This is what I do.</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <p>My name is Hoan</p>
          <p>I'm very handsome</p>
        </div>
      </div>
    </div>

    <hr>

    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <ul class="list-inline text-center">
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
            </ul>
            <p class="copyright text-muted">Copyright &copy; Tech Blog 2018 </p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Bootstrap core JavaScript -->
    <script src="/static/theme/vendor/jquery/jquery.min.js"></script>
    <script src="/static/theme/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Custom scripts for this template -->
    <script src="/static/theme/js/clean-blog.min.js"></script>

  </body>

</html>
```

### SoketIO
```
npm install socket.io --save
```

app.js
```
var socketio = require("socket.io");

var server = app.listen(port, host, function(){
	console.log("app is running on port", port);
});

var io = socketio(server);
```

Chạy thử 

### Chức năng chat
apps\controllers\index.js
```
router.get("/chat", function(req, res){
	res.render("chat.ejs");
});
```

\apps\views\chat.ejs
```
<!DOCTYPE html>
<html>
<head>
	<title>Chat Application</title>
	<%- include('admin/layout/head.ejs') %>
	<style type="text/css">
		* { margin: 0; padding: 0; box-sizing: border-box; } 
	      body { font: 13px Helvetica, Arial; }
	      form { background: #000; padding: 3px; position: fixed; bottom: 40px; width: 90%; }
	      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
	      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
	      #messages { list-style-type: none; margin: 0; padding: 0; }
	      #messages li { padding: 5px 10px; }
	      #messages li:nth-child(odd) { background: #eee; }
	</style>
</head>
<body>
	<div class="container">

		<!-- Tạo 1 hàng để nhập text chat -->
		<ul id="conversation">
			
		</ul>
		<form>
			<!-- Tạo ô input để nhập nội dung chat -->
			<input type="text" name="message" id="message">
			<!-- Tạo nut button để send -->
			<button class="btn btn-success" id="btn-send">Send</button>
		</form>
	</div>
</body>
</html>
```
### Xử lý logic
app.js
```
var socketcontrol = require("./apps/common/socketcontrol.js")(io);
```

apps\common\socketcontrol.js
```
module.exports = function (io){
	io.sockets.on("connection", function(socket){
		console.log("Have a new user connected");
	});
}
```

\apps\views\chat.ejs
```
<script src="https://cdn.socket.io/4.5.0/socket.io.js"></script>

<script type="text/javascript">
	let socket = io.connect("http://localhost:3000/");
</script>
```

### Show message

apps\views\chat.ejs
```
<script type="text/javascript">	
	let socket = io.connect("http://localhost:3000");
	
	// Thông báo đã kết nối được ở phía client
	socket.on("connect", function(){
		console.log("User is conecting");

		// Hỏi tên của người dùng
		let username = prompt("What is your name");

		// Gửi tên này lên server. Trong socket dùng hàm emit để gửi
		socket.emit("addUser", username);
	});
	
	// LẮng nghe sự kiện update_user
	socket.on("update_message", function(data){
		$("#conversation").append("<li> <b>" + data.sender + ": </b>" + data.message + "</li>");

	});
	
</script>
```

apps\common\socketcontrol.js
```
module.exports = function (io){	
	var usernames = [];
	io.sockets.on("connection", function(socket){
		console.log("Have a new user connected");
		
		// LẮng nghe sự kiện addUser bên chat.ejs
		socket.on("addUser", function(username){
			// Lưu tên này lại
			socket.username = username;
			usernames.push(username);

			// notyfi myself và gửi lên chính nó 
			let data = {
				sender: "SERVER",
				message : "You have join chat room"
			};
			socket.emit("update_message", data);

			// Gửi thông báo tới toàn mọi người rằng người này đã join phòng chát
			data = {
				sender: "SERVER",
				message: username + " have join chat room"
			};
			socket.broadcast.emit("update_message", data)
		});
		
	});
}
```

### Send message event
apps\views\chat.ejs
```
// Không cho gửi form của btn-send nữa để tránh mỗi lần send phải nhập username lại
// Làm bằng cách return false luôn khi gửi form lên
$("form").submit(function(){
	return false
});
		
// Bắt sự kiện click send message
$("#btn-send").click(function(e){

	//Lấy nội dung message ra
	 let message = $("#message").val();

	 //Reset message này về rỗng
	 // để sau khi click send thì ô nhập tin nhắn về trống 
	 // để nhập nội dung chat tiếp theo.
	 $("#message").val("");

	 // Gửi message lên server
	 if (message.trim().length != 0) { // Nếu message khác rỗng thì gửi lên server
		socket.emit("send_message", message);
	 } 
});
```

apps\common\socketcontrol.js
```
// Lắng nghe sự kiện user gửi message lên
socket.on("send_message", function(message){
	// notify mysefl và gửi lên chính nó
	let data = {
		sender: "You",
		message: message
	};

	socket.emit("update_message", data);

	// Notify other user và gửi thông báo message cho các user khác
	data = {
		sender: socket.username,
		message: message
	};
	socket.broadcast.emit("update_message", data)
});
```

### disconnect
apps\common\socketcontrol.js
```
// Lắng nghe sự kiện user disconnect
socket.on("disconnect", function(){

	// Xóa cái user vừa disconnect này đi
	for (let i = 0; i < usernames.length;i++ ){
		if (usernames[i] == socket.username ){
			usernames.splice(i, 1);
		}
	}

	// Thông báo tới mọi người user này vừa thoát
	let data = {
		sender: "SERVER",
		message: socket.username + " have leave chat room"
	};
	socket.broadcast.emit("update_message", data);
});
```







