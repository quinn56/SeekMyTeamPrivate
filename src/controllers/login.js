var crypto = require("../helpers/crypto");
var express = require("express");
var path = require('path');

var router = express.Router();
var database = require('../app').database;

var User = require('../models/User');

router.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../views/login.html'));
});


router.post('/', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var params = {
        TableName : 'Users',
        Key : { 
          "Email" : {'S' : email}
        }
    };
    
    database.getItem(params, function(err, data) {
        if (err) {
            /* User not found */
           res.status(400).end();
        } else {
            var retrievedUser = data.Item;

            var hashedPassword = crypto.sha512(password, retrievedUser.Salt.S);
            /* Correct password */
            if (retrievedUser.Password.S === hashedPassword.passwordHash) {
                /* User still needs to confirm account */
                if (!retrievedUser.Confirmed) {
                    res.status(401).end();
                } else {
                    var user = User.summarize(retrievedUser);
                    req.session.user = user;
                    res.status(200).end();
                }
            } else {
                // Passwords did not match
                res.status(402).end();
            }
        }
    });
});


module.exports = router;