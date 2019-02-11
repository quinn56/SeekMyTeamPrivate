var AWS = require('aws-sdk');

AWS.config.region = process.env.REGION

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
module.exports.app = app;

var sns = new AWS.SNS();
var database = new AWS.DynamoDB();
module.exports.database = database;

var snsTopic =  process.env.NEW_SIGNUP_TOPIC;

app.set('views', __dirname + '/views/');
app.use(bodyParser.urlencoded({extended:false}));

// Hookup controllers for endpoints
app.use(require('./controllers'));

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

module.exports = server;
