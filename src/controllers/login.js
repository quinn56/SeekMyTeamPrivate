var crypto = require("../helpers/crypto");
var express = require("express");
var router = express.Router();

var database = require('../app').database;

router.post('/', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var params = {
        AttributesToGet: [
          'Password',
          'Salt'
        ],
        TableName : 'Users',
        Key : { 
          "Email" : {'S' : email}
        }
    };
    
    database.getItem(params, function(err, data) {
        if (err) {
            var returnStatus = 500;

            if (err.code = 'ResourceNotFoundException') {
                returnStatus = 400;
            }

            res.status(returnStatus).end();
        } 
        else {
            retrievedPass = data.Item.Password;
            salt = data.Item.Salt;
        }
    });

    var hashedPassword = crypto.sha512(password, salt);
   
    // Successful login, gonna have to do a loooot more here 
    if (retrievedPass === hashedPassword) {
        res.status(200).end();
   
    } else {
        // Passwords did not match
        res.status(401).end();
    }
});

module.exports = router;