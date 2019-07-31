var express = require("express");
var https = require('https');
var http = require('http');
var fs = require('fs');

var options = {
   key: fs.readFileSync('public/keys/privkey.pem'),
   cert: fs.readFileSync('public/keys/fullchain.pem')
 };

var app = express();

app.use("/public", express.static(path.join(__dirname, "/public")));


http.createServer(app).listen(80);
https.createServer(options, app).listen(443);


// var server = app.listen(80, function(){
//    var port = server.address().port;
//    console.log("Server started at http://localhost:%s", port);
// });