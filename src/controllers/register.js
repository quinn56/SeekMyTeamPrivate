var crypto = require("../helpers/crypto");
var mailer = require("../helpers/mailer");
var express = require("express");
var path = require('path');

var router = express.Router();
var database = require('../app').database;

router.post('/', function(req, res) {
    var passObj = saltHashPassword(req.body.password);

    var confirmationCode = generateConfirmationCode();

    // New item to represent a user
    // should update with blank fields in the future for 
    // desc and other stuff
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
            console.log('DDB Error: ' + err);
        } else {
            //mailer.sendCode(req.body.email, confirmationCode);
            res.status(200).end();
        }
    });
});

router.get('/confirm', function(req, res) {
    if (req.session) {
        req.session.email = req.query.email;
    }
        
    res.sendFile(path.resolve(__dirname + '/../views/confirm.html'));
});

router.post('/confirm', function(req, res) {
    /* Verifying email here */
    var email;
    if (req.session && req.session.email) {
        email = req.session.email;
    } else {
        email = req.body.email;
    }
    var params = {
        TableName : 'Users',
        Key : { 
          "Email" : {'S' : email}
        }
    };
    
    database.getItem(params, function(err, data) {
        if (err) {
           /* No user with that email found */ 
           res.status(401).end(); 
        } else {
            var retrievedCode = data.Item.Code.S;

            if (retrievedCode !== req.body.code) {
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
                  res.status(200).end();
                }
            });   
        }
    });
});

router.post('/resendCode', function(req, res) {
    var code = generateConfirmationCode();

    var params = {
        TableName: "Users",
        Key: {
            'Email' : req.body.email
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