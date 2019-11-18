const express = require('express');
const app = express();
const helmet = require('helmet');
app.use(helmet());

const mongoose = require('mongoose');
const http = require('http');
const config = require('./config.json');

mongoose.Promise = global.Promise;
mongoose.connect(config.serverConfig.databaseUrl, {useNewUrlParser: true});


var captionEndpoint = require("./routes/captionEndpoint.js");
captionEndpoint.captionRequestTimer();
captionEndpoint.captionResultTimer();

var instagramEndpoint = require("./routes/instagramEndpoint.js");
// instagramEndpoint.commentTimer();

let port = 8080;

app.use('/', instagramEndpoint.router);


http.createServer(app).listen(port, function() {
    console.log('Instagram Util Server started at port: ' + port);
  });
