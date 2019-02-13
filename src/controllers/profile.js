var express = require("express");
var router = express.Router();

var database = require('../app').database;

router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
});

router.post('/delete', function(req, res) {
    var queryParams = {
        TableName : "Posts",
        KeyConditionExpression: "Email = :email",
        ExpressionAttributeValues: {
            ":email": req.body.email
        }
    };

    var itemsArray = [];
    
    /* Query for all posts matching users email */
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
            
            /* Delete all posts associated with user */
            database.batchWrite(deleteParams, function(err, data) {
                if (err) {
                    console.log('Batch delete unsuccessful ...');
                    console.log(err, err.stack); // an error occurred
                    res.status(401).end();
                } else {
                    console.log('Batch delete successful ...');
                    console.log(data); // successful response
                    
                    /* Finally, delete user from table */
                    database.deleteItem({
                        "TableName": "Users", 
                        "Key" : {
                            "Email": { "S" : req.body.email }
                        }
                    }, function (err, data) {
                        if (err) {
                            res.status(402).end();
                        } else {
                            res.status(200).redirect('/login');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;