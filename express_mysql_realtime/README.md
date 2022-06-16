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

Test: tạo file css \public\css\main.css
```http://localhost:3000/static/css/main.css```

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



