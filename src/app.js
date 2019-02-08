var AWS = require('aws-sdk');

AWS.config.region = process.env.REGION

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var routes = require('./routes');

var sns = new AWS.SNS();
var ddb = new AWS.DynamoDB();

var snsTopic =  process.env.NEW_SIGNUP_TOPIC;

app.set('views', __dirname + '/views/');
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', routes);

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

module.exports = app;
module.exports.database = ddb;