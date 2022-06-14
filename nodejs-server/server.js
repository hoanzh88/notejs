/*
// Bước 1: Import module http
var http = require('http');
 
// Bước 2: Khởi tạo server
var server = http.createServer(function(request, response){
    // Biến request: là biến lưu trữ thông tin gửi lên của client
    // Biến response: là biến lưu trữ các thông tin trả về cho client
     
    // Thiết lập Header
    response.writeHead(200, {
        "Context-type" : "text/plain"
    });
     
    // Show thông tin
    response.write('Your URL is ' + request.url);
     
    // Kết thúc
    response.end();
});
 
// Bước 3: Lắng nghe cổng 300 thì thực hiện chương trình
server.listen(3000, function(){
    console.log('Connected Successfull!');
});
*/

// Bước 1: Import module http và fs
var http = require('http');
var fs = require('fs');
 
// Bước 2: Khởi tạo server
var server = http.createServer(function(request, response){
/*
	response.setHeader('Context-type', 'text/html');
    response.setHeader('author', 'thehalfheart@gmail.com');
    response.setHeader('blog', 'freetuts.net');
    response.writeHead(200, {});
    response.end();
*/
    // Biến request: là biến lưu trữ thông tin gửi lên của client
    // Biến response: là biến lưu trữ các thông tin trả về cho client
   
    // Kiểm tra URL truy cập phải trang about ko
    if (request.url == '/about.html')
    {
		response.setHeader('abc', 'hoanzh88@gmail.com');
		response.setHeader('abc1', 'gia tri 1');
		response.setHeader('abc2', 'gia tri 2');
        // Thiết lập Header
        response.writeHead(200, {
            "Context-type" : "text/html"
        });
    
        // Show thông tin trang about
        fs.createReadStream('./about.html').pipe(response);
    }else if (request.url == '/index.html')
    {
        // Thiết lập Header
        response.writeHead(200, {
            "Context-type" : "text/html"
        });
         
        // Show thông tin trang about
        fs.createReadStream('./index.html').pipe(response);
    }
    else // trường hợp ngược lại ko tìm thấy file
    {
        // Thiết lập Header
        response.writeHead(404, {
            "Context-type"  : "text/html",
			"author"        : "thehalfheart@gmail.com",
			"blog"          : "freetuts.net"
        });
         
        // Show lỗi không tìm thấy trang
        response.write('404 Not Found ' + request.url);
         
        // Kết thúc
        response.end();
    }

});
 
// Bước 3: Lắng nghe cổng 300 thì thực hiện chương trình
server.listen(3000, function(){
    console.log('Connected Successfull!');
});