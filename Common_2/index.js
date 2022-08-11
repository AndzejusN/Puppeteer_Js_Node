let http = require('http');
let date = require('./date');


http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.write('\nHello');
    res.write("The date and time are currently: " + date.myDateTime());
    res.end();
}).listen(8080);

