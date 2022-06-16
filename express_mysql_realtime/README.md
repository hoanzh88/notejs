### Xây dựng ứng dụng thời gian thực với Nodejs express & mysql
Khởi tạo cơ bản:
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




