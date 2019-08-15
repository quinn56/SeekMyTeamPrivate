var AWS = require('aws-sdk');

AWS.config.region = process.env.REGION

const mailgun = require("mailgun-js");
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

const multer = require('multer');
module.exports.multer = multer;

const multers3 = require('multer-s3');
module.exports.multers3 = multers3;

const s3 = new AWS.S3();
module.exports.s3 = s3;

/* Configure our SMTP Server details */
const mg = mailgun({apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN});
module.exports.mg = mg;

const crypto = require("crypto");
module.exports.crypto = crypto;

const uuid = require("uuid");
module.exports.uuid = uuid;

var app = express();

/* Set the static files location, for use with angular */
app.use(express.static(path.resolve(__dirname + '/public/dist')));

/* Disable xpowered header, security++ */
app.disable('x-powered-by') 

/* Connect database */
var database = new AWS.DynamoDB(); 
module.exports.database = database;

app.use(bodyParser.json());
    
/* Catch error fro jwt token */
app.use(function(err, req, res, next) {        
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({'message': err.name + ': ' + err.message})
    }
});

/* Hookup controllers for endpoints w/ angular */
app.use('/api', require('./controllers'));

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
  ];


/* Angular hookup */
 app.use('*', function (req, res) {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
      res.sendFile(path.resolve(__dirname + `./public/dist/${req.url}`));
    } else {
      res.sendFile(path.resolve(__dirname + '/public/dist/index.html'));
    }
  });

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

module.exports = server;
module.exports.app = app;