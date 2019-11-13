
const express = require('express');
const app = express();
const helmet = require('helmet');
app.use(helmet());

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const wei = require('wei');

const winston = require('./config/winston');
const api = require('./routes/api');
const config = require('./config.json');

var options = {
   key: fs.readFileSync('./keys/privkey.pem'),
   cert: fs.readFileSync('./keys/fullchain.pem')
 };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan('dev'));
app.use(morgan('combined', { stream: winston.stream }));

let port = process.env.PORT || 80;

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.use("/public/web", express.static(path.join(__dirname, "/public/web"), {maxAge:10000}));
app.use("/public/images", express.static(path.join(__dirname, "/public/images"), {maxAge:10000}));

app.use('/api', api);

mongoose.Promise = global.Promise;
mongoose.connect(config.serverConfig.databaseUrl, {useNewUrlParser: true});

const appid = 'wx153892d5b43e7bd1';
const appsecret = '565e8888db8a104d718ee45ab4233dc0';

/**
 * 微信认证需要的授权文件
 */
app.get('/MP_verify_Mti1B4FBENHQdphV.txt', async (req, res) => {
  res.send('Mti1B4FBENHQdphV');
});

/**
 * 这里是入口，直接返回html
 */
app.get('/', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.sendFile(`${__dirname}/index.html`);
    return;
  }
  const userInfo = await wei.authorize({
    appid,
    appsecret,
    code, // 此处code可在授权后重定向的url上拿到。
  }, {
    check(actoke) {
      // 这里可以写数据库逻辑
      // 在这里访问数据库获取，userInfo 就不会去微信拿了
    },
  });
  console.log(userInfo);
  res.cookie('userId', userInfo.openid);
  res.cookie('userName', userInfo.nickname);
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/admin', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/activePage', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/videoDetail', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/videoDetailNew', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/videoDetailSpecificScreen', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
});

http.createServer(app).listen(port, function() {
  console.log('Server started at port: ' + port);
});
https.createServer(options, app).listen(443);
