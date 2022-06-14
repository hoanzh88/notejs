var http = require('http');
var fs = require('fs');

var server = http.createServer(function(request, response){
 if (request.url == '/trangchu.html')
    {
        response.writeHead(200, {
            "Context-type" : "text/html"
        });    
  
        fs.createReadStream('./trangchu.html').pipe(response);
    }else if (request.url == '/tintuc.html')
    {
        response.writeHead(200, {
            "Context-type" : "text/html"
        });    
  
        fs.createReadStream('./tintuc.html').pipe(response);
    }else if (request.url == '/lienhe.html')
    {
        response.writeHead(200, {
            "Context-type" : "text/html"
        });    
  
        fs.createReadStream('./lienhe.html').pipe(response);
    }else{
		// Thiết lập Header
        response.writeHead(404, {
            "Context-type"  : "text/html",
			"author"        : "hoanzh88@gmail.com",
			"blog"          : "abc.net"
        });
         
        // Show lỗi không tìm thấy trang
        response.write('404 Not Found ' + request.url);
         
        // Kết thúc
        response.end();
	}


});

server.listen(3000, function(){
    console.log('Connected Successfull!');
});