var express = require("express");
var router = express.Router();
var path = require("path");

var User = require("../models/User");
var database = require('../app').database;


router.get('/:email', function(req, res) {
    var email = req.params.email;
     
    var params = {
        TableName : process.env.USERS_TABLE,
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
            var user = User.summarize(data.Item)
            res.status(200).json({
                "user": user
            });
        }
    });
});

/*router.post('/delete', function(req, res) {
    var queryParams = {
        TableName : "Posts",
        KeyConditionExpression: "Email = :email",
        ExpressionAttributeValues: {
            ":email": req.body.email
        }
    };

    var itemsArray = [];
    
     Query for all posts matching users email 
    database.query(queryParams, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                var item = {
                    DeleteRequest : {
                        Key : {
                            'PostID' : item.PostID    
                        }
                    }
                };
                itemsArray.push(item);
            });
            var deleteParams = {
                RequestItems : {
                    'Post' : itemsArray
                }
            };
            
             Delete all posts associated with user 
            database.batchWrite(deleteParams, function(err, data) {
                if (err) {
                    console.log('Batch delete unsuccessful ...');
                    console.log(err, err.stack); // an error occurred
                    res.status(401).end();
                } else {
                    console.log('Batch delete successful ...');
                    console.log(data); // successful response
                    
                    Finally, delete user from table 
                    database.deleteItem({
                        "TableName": "Users", 
                        "Key" : {
                            "Email": { "S" : req.body.email }
                        }
                    }, function (err, data) {
                        if (err) {
                            res.status(402).end();
                        } else {
                            res.status(200).end();
                        }
                    });
                }
            });
        }
    });
});*/
router.post('/delete', function(req, res) {
    database.deleteItem({
        "TableName": process.env.USERS_TABLE, 
        "Key" : {
            "Email": { "S" : req.body.email }
        }
    }, function (err, data) {
        if (err) {
            res.status(402).end();
        } else {
            res.status(200).end();
        }
    });
});

router.post('/upload', function(req, res) {
    // Upload image, file, etc. to S3 bucket here
});

router.post('/update', function(req, res) {   
    var description = req.body.description;
    var skills = req.body.skills;
    var email = req.payload.email;     

    var params = {
        ExpressionAttributeNames: {
         "#C": "Description",
         "#S": 'Skills'
        }, 
        ExpressionAttributeValues: {
         ":c": {
           'S': description
          },
          ":s": {
              'S': skills
          }
        }, 
        Key: {
         "Email": {
           'S': email
          }
        }, 
        TableName: process.env.USERS_TABLE, 
        UpdateExpression: "SET #C = :c, #S = :s"
    };

    database.updateItem(params, function(err, data) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });  
});

module.exports = router;