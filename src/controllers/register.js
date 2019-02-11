var crypto = require("../helpers/crypto");
var mailer = require("../helpers/mailer");
var express = require("express");
var router = express.Router();

var database = require('../app').database;

router.post('/start', function(req, res) {
    var passObj = saltHashPassword(req.body.password);

    var confirmationCode = generateConfirmationCode();

    // New item to represent a user
    // should update with blank fields in the future for 
    // desc and other stuff
    var item = {
        'Email': {'S': req.body.email},
        'Name': {'S': req.body.name},
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
                returnStatus = 409;
            }

            res.status(returnStatus).end();
            console.log('DDB Error: ' + err);
        } else {
            mailer.sendCode(req.body.email, confirmationCode);
            res.status(200).end();
        }
    });
});

router.post('/commit', function(req, res) {
    /* Verify email here */
    var email = req.body.email;

    var params = {
        TableName: "Users",
        UpdateExpression: "set Confirmed = :true",
        ConditionExpression: "Code = :code",
        ExpressionAttributeValues:{
            ":true": true,
            ":code": req.body.code
        }
    };

    console.log("Attempting confirmation of user...");
    database.putItem(params, function(err, data) {
        if (err) {
            var returnStatus = 500;

            if (err.code === 'ConditionalCheckFailedException') {
                returnStatus = 409;
            }

            res.status(returnStatus).end();
            console.log('DDB Error: ' + err);
        } else {
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