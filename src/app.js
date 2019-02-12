var AWS = require('aws-sdk');

AWS.config.region = process.env.REGION

const mailgun = require("mailgun-js");
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
const api_key = '8d54b48db11d88a60c874686ce476d00-1b65790d-c59b878c';
const DOMAIN = 'sandboxe1aea5edfa8f4904b65d4facc650f8c2.mailgun.org';
const mg = mailgun({apiKey: api_key, domain: DOMAIN});
module.exports.mg = mg;

const crypto = require("crypto");
module.exports.crypto = crypto;

const uuid = require("node-uuid");
module.exports.uuid = uuid;

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
