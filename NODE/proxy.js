var http=require('http'),
    https=require('https'),
    path = require('path');

// Create HTTP Server
http.createServer(function(req,res){
    var uri = 'https://github.com/' + req.url,
        file = req.url.replace(/\?.*/ig, ''),
        ext = path.extname(file),
        type = getContentType(ext);

    res.writeHead(200,{
        'Content-Type': type
    });
    https.get(uri,function(response){
        console.log('start');
        var datas='';
        response.setEncoding('utf8');
        response.on('data',function(chunk){
            datas += chunk;
        });
        response.on('end',function(){
            res.end(datas);
        });

        console.log('end');
    });

}).listen(3000);

// Get Content-Type
var getContentType = function(ext) {
    var contentType ='';
    switch(ext){
        case '':
            contentType = 'text/html';
            break;
        case '.html':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.ico':
            contentType = 'image/icon';
            break;
        default:
            contentType = 'application/octet-stream';
    }
}