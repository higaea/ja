
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const api = require('./routes/api');
const config = require('./config.json');

var options = {
   key: fs.readFileSync('./keys/privkey.pem'),
   cert: fs.readFileSync('./keys/fullchain.pem')
 };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

let port = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, "/public")));

// app.get('/', (req, res) => {
//     res.json({message: 'Hi, how can I help you?'});
// })

app.use('/api', api);

mongoose.Promise = global.Promise;
mongoose.connect(config.serverConfig.databaseUrl);


http.createServer(app).listen(80, function() {
  console.log('Server started at port: ' + 80);
});
https.createServer(options, app).listen(443);
