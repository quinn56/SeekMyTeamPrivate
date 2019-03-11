var path = require('path');
var express = require("express");
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: 'payload'
});

var router = express.Router();

var database = require('../app').database;

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/profile', auth, require('./profile'));

router.get('/posts', auth, function(req, res) {
    var params = {
        TableName: process.env.POSTS_TABLE,
        Limit: 1 
    };

    if (req.params && req.params.ExclusiveStartKey) {
        params.ExclusiveStartKey = req.params.ExclusiveStartKey;
    }
    database.scan(params, function (err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        if (data.LastEvaluatedKey) {            
            res.status(200).json({
                "posts": data.Items,
                "key": data.LastEvaluatedKey
            });
        } else {
            res.status(201).json({
                "posts": data.Items,
                "key": null
            });
        }
    }
    });
});

router.post('/savePost', auth, function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var owner = req.payload.email;

    var item = {
        'Name': {'S': name},
        'Description' : {'S' : description},
        'Owner': {'S': owner},
    };

    var params = { 
        'TableName': process.env.POSTS_TABLE,
        'Item': item,
        'ConditionExpression': 'attribute_not_exists(Owner)'
    };

    database.putItem(params, function(err, data) {
        if (err) {
            var returnStatus = 500;

            if (err.code === 'ConditionalCheckFailedException') {
                returnStatus = 401;
            }

            res.status(returnStatus).end();
        } else {
            res.status(200).end();
        }
    });
});

router.post('/updatePost', auth, function(req, res) {
    var name = req.body.name;
    var description = req.body.description;

    var params = {
        ExpressionAttributeNames: {
         "#C": 'Description'
        }, 
        ExpressionAttributeValues: {
         ":c": {
           'S': description
          }
        }, 
        Key: {
         "Name": {
           'S': name
          }
        }, 
        TableName: process.env.POSTS_TABLE, 
        UpdateExpression: "SET #C = :c"
    };

    database.updateItem(params, function(err, data) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });  
});

router.post('/deletePost', auth, function(req, res) {
    database.deleteItem({
        "TableName": process.env.POSTS_TABLE, 
        "Key" : {
            "Name": { 
                "S" : req.body.name 
            }
        }
    }, function (err, data) {
        if (err) {
            res.status(402).end();
        } else {
            res.status(200).end();
        }
    });
});

module.exports = router;