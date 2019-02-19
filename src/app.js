var AWS = require('aws-sdk');

AWS.config.region = process.env.REGION

const mailgun = require("mailgun-js");
var express = require('express');
var bodyParser = require('body-parser');
var session = require('cookie-session');

/* Configure our SMTP Server details */
const api_key = process.env.MAILGUN_KEY;
const domain = process.env.MAILGUN_DOMAIN;

const mg = mailgun({apiKey: api_key, domain: domain});
module.exports.mg = mg;

const crypto = require("crypto");
module.exports.crypto = crypto;

const uuid = require("uuid");
module.exports.uuid = uuid;

var app = express();

/* Set the static files location, for use with angular */
//app.use(express.static(__dirname + '/public'));

/* Disable xpowered header, security++ */
app.disable('x-powered-by') 

/* Connect database */
var database = new AWS.DynamoDB(); 
module.exports.database = database;

app.use(bodyParser.urlencoded({extended:false}));

/* Use cookie sessions, last one hour */
app.use(
    session({
        name: 'session',
        secret: 'zmalfkoitpsivbfaas',
        maxAge: 60 * 60 * 1000  // Cookie lasts one hour
    })
);
    
/* Login required for all paths besides login,         */
/* / (for now), register/confirm(for now)              */

/* Remove / once we have a working login page that     */
/* handles registrations and in-step confirmations as  */
/* well. Also remove register/confirm in future since  */
/* we only show the confirm page to logged in users    */
/* who are not already confirmed                       */
app.use(function(req, res, next) {
    if (req.path === '/login' || req.path === '/' || req.path === '/register/confirm') {
        next();
    } else {        
        if (req.session && req.session.user) {    
            next();    
        } else {
        res.status(400).send('unauthorized').end();
    }
}
});

/* Hookup controllers for endpoints w/ angular */
//app.use('/api', require('./controllers'));

/* Hookup controllers for endpoints w/o angular */
app.use(require('./controllers'));


/* Angular hookup */
/*app.use('*', function(req, res) {
    res.sendfile('./public/index.html');
})*/

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

module.exports = server;
module.exports.app = app;
