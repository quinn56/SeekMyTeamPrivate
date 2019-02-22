var crypto = require("../helpers/crypto");
var mailer = require("../helpers/mailer");
var express = require("express");
var path = require('path');
var jwt = require('jsonwebtoken');

var router = express.Router();
var database = require('../app').database;

router.post('/', function(req, res) {
    var passObj = saltHashPassword(req.body.password);

    var confirmationCode = generateConfirmationCode();

    // New item to represent a user
    // should update with blank fields in the future for 
    // skills and other stuff
    var item = {
        'Email': {'S': req.body.email},
        'Name': {'S': req.body.name},
        'Description' : {'S' : ' '},
        'Password' : {'S': passObj.passwordHash}, 
        'Salt' : {'S': passObj.salt},
        'Confirmed' : {'BOOL' : false},
        'Code' : {'S' : confirmationCode}
    };

    var params = { 
        'TableName': "Users",
        'Item': item,
        'ConditionExpression': 'attribute_not_exists(Email)'
    };

    database.putItem(params, function(err, data) {
        if (err) {
            var returnStatus = 500;

            if (err.code === 'ConditionalCheckFailedException') {
                returnStatus = 401;
            }

            res.status(returnStatus).end();
        } else {
            mailer.sendCode(req.body.email, confirmationCode);
            res.status(200).end();
        }
    });
});

router.post('/confirm', function(req, res) {
    /* Verifying email here */
    var email = req.body.email;
    var code = req.body.code;
    
    var params = {
        TableName : 'Users',
        Key : { 
          "Email" : {'S' : email}
        }
    };
    
    database.getItem(params, function(err, data) {
        if (err) {
            res.status(500).end(); 
        } else {
            /* No user with that email found */
            if (data.Item === undefined) {
                res.status(401).end();
                return;
            } 
            var retrievedCode = data.Item.Code.S;

            if (retrievedCode !== code) {
                /* Invalid code */
                res.status(403).end();
            }

            var params = {
                ExpressionAttributeNames: {
                 "#C": "Confirmed"
                }, 
                ExpressionAttributeValues: {
                 ":c": {
                   'BOOL': true
                  }
                }, 
                Key: {
                 "Email": {
                   'S': email
                  }
                }, 
                TableName: "Users", 
                UpdateExpression: "SET #C = :c"
            };
        
            database.updateItem(params, function(err, data) {
                if (err) {
                    res.status(500).end();
                } else {
                    var expiry = new Date();
                    expiry.setDate(expiry.getDate() + 7);
                    
                    var token = jwt.sign({
                        email: email,
                        exp: parseInt(expiry.getTime() / 1000)
                    }, process.env.TOKEN_SECRET)
                   
                    /* Succesful confirmation, generate token */
                    res.status(200).json({
                        'token': token 
                    });
                }
            });   
        }
    });
});

/** CHANGE FOR JWTS **/
router.post('/resendCode', function(req, res) {
    var code = generateConfirmationCode();

    var params = {
        TableName: "Users",
        Key: {
            'Email' : req.body.email    // Maybe req.session.user.email?
        },
        UpdateExpression: "set Code = :code",
        ExpressionAttributeValues:{
            ":code": code
        }
    };
    
    database.updateItem(params, function(err, data) {
        if (err) {
            res.status(500).end();    
        } else {
            mailer.sendCode(req.body.email, confirmationCode);
            res.status(200).end();
        }
    });
});

function saltHashPassword(password) {
    var salt = crypto.genRandomString(16); /** Gives us salt of length 16 */
    return crypto.sha512(password, salt);
}

function generateConfirmationCode() {
    return crypto.genRandomString(5);
}

module.exports = router;