var express = require("express");
var router = express.Router();

var userid = 0;
var database = require('../app').database;

router.post('/', function(req, res) {
    var item = {
        'UserID' : {'S': '001'+userid},
        'email': {'S': req.body.email},
        'name': {'S': req.body.name},
        'password' : {'S': salthash(req.body.password)}
    };
    userid++;
    console.log("posting item: " + item);

    database.putItem({
        'TableName': "Users",
        'Item': item,
        'Expected': { UserID: { Exists: false } }
    }, function(err, data) {
        if (err) {
            var returnStatus = 500;

            if (err.code === 'ConditionalCheckFailedException') {
                returnStatus = 409;
            }

            res.status(returnStatus).end();
            console.log('DDB Error: ' + err);
        } else {
            /*sns.publish({
                'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email
                                    + "\r\nPreviewAccess: " + req.body.previewAccess
                                    + "\r\nTheme: " + req.body.theme,
                'Subject': 'New user sign up!!!',
                'TopicArn': snsTopic
            }, function(err, data) {
                if (err) {
                    res.status(500).end();
                    console.log('SNS Error: ' + err);
                } else {
                    res.status(201).end();
                }
            });*/
            console.log("use cognito to verify");
        }
    });
});

function salthash(password) {
    return password+"abc";
}

module.exports = router;