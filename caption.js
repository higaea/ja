const express = require('express');
const app = express();
const helmet = require('helmet');
app.use(helmet());

const mongoose = require('mongoose');
const config = require('./config.json');

mongoose.Promise = global.Promise;
mongoose.connect(config.serverConfig.databaseUrl, {useNewUrlParser: true});


var captionEndpoint = require("./routes/captionEndpoint.js");
captionEndpoint.captionRequestTimer();
captionEndpoint.captionResultTimer();

var instagramEndpoint = require("./routes/instagramEndpoint.js");
instagramEndpoint.commentTimer();
