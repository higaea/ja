var express = require("express");

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');

const api = require('./routers/api');
const config = require('./config.json');

var options = {
   key: fs.readFileSync('public/keys/privkey.pem'),
   cert: fs.readFileSync('public/keys/fullchain.pem')
 };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

let port = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.json({message: 'Hi, how can I help you?'});
})

app.use('/api', api);

mongoose.Promise = global.Promise;
mongoose.connect(config.serverConfig.databaseUrl);

app.use("/public", express.static(path.join(__dirname, "/public")));

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);


// var server = app.listen(80, function(){
//    var port = server.address().port;
//    console.log("Server started at http://localhost:%s", port);
// });