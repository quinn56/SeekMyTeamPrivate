var AWS = require('aws-sdk');

AWS.config.region = process.env.REGION

const mailgun = require("mailgun-js");
var express = require('express');
var bodyParser = require('body-parser');
var session = require('cookie-session');

/*
    Configure our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
const api_key = '8d54b48db11d88a60c874686ce476d00-1b65790d-c59b878c';
const DOMAIN = 'sandboxe1aea5edfa8f4904b65d4facc650f8c2.mailgun.org';
const mg = mailgun({apiKey: api_key, domain: DOMAIN});
module.exports.mg = mg;

const crypto = require("crypto");
module.exports.crypto = crypto;

const uuid = require("uuid");
module.exports.uuid = uuid;

var app = express();

/* Disable xpowered header, security++ */
//app.disable('x-powered-by') 
module.exports.app = app;

/* Connect database */
var database = new AWS.DynamoDB(); 
module.exports.database = database;

app.set('views', __dirname + '/views/');

app.use(bodyParser.urlencoded({extended:false}));

/* Use cookie sessions, last one hour */
app.use(
    session({
        name: 'session',
        secret: 'zmalfkoitpsivbfaas',
        maxAge: 60 * 60 * 1000  // Cookie lasts one hour
    })
);

/* Login required for all paths besides login/register */
/* Remove register check if necessary since both will  */
/* be on login page?                                   */
app.use(function(req, res, next) {
    if (req.url === '/login' || req.url === '/register/confirm' || req.url === '/register') {
        next();
    } else {
        if (!req.session && !req.session.user) {
            res.status(400).send('unauthorized').end();
        } else {
            next();
        }
    }
});

/* Hookup controllers for endpoints */
app.use(require('./controllers'));

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

module.exports = server;
