var path = require('path');
var express = require("express");
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: 'payload'
});
var mailer = require('../helpers/mailer');

var router = express.Router();

var database = require('../app').database;

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/profile', auth, require('./profile'));
router.use('/users', auth, require('./users'));

router.get('/post/:name', auth, function(req, res) {
    var name = req.params.name;
    var params = {
        TableName : process.env.POSTS_TABLE,
        Key : { 
          "Name" : {'S' : name}
        }
    };

    database.getItem(params, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
             /* No user with that email found */
             if (data.Item === undefined) {
                res.status(401).end();
                return;
            } 
            res.status(200).json({
                "post": data.Item
            });
        }
    });
});

router.get('/posts', auth, function(req, res) {
    var params = {
        TableName: process.env.POSTS_TABLE,
        Limit: 15
    };

    if (req.query && req.query.ExclusiveStartKey !== "null") {
        params.ExclusiveStartKey = {"Name": {'S': req.query.ExclusiveStartKey}};
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

router.get('/userPosts', auth, function(req, res) {
    var params = {
        TableName: "Posts",
        FilterExpression: "#owner = :email",
        ExpressionAttributeNames: {
            "#owner": "OwnerEmail",
        },
        ExpressionAttributeValues: {
             ":email": {
                 'S': req.query.email
             }
        }
    };
    
    database.scan(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {    
            res.status(200).json({
                "posts": data.Items,
            });
        }
    });
});

router.get('/appliedPosts', function (req, res) {
    var email = req.query.email;
    var params = {
        TableName : process.env.USERS_TABLE,
        Key : { 
          "Email" : {'S' : email}
        }
    };

    database.getItem(params, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
             /* No user with that email found */
             if (data.Item === undefined) {
                res.status(401).end();
                return;
            } 
            res.json({
                posts: JSON.parse(data.Item.AppliedPosts.S)
            });
        }
    });
});

// router.get('/postComments', function (req, res) {
//     var email = req.query.email;
//     var params = {
//         AttributesToGet: [
//             "comments"
//           ],
//         TableName : process.env.USERS_TABLE,
//         Key : { 
//           "Email" : {'S' : email}
//         }
//     };

//     database.getItem(params, function(err, data) {
//         if (err) {
//             console.log(err);
//             res.status(500).end();
//         } else {
//              /* No user with that email found */
//              if (data.Item === undefined) {
//                 res.status(401).end();
//                 return;
//             } 
//             res.json({
//                 posts: JSON.parse(data.Item.AppliedPosts.S)
//             });
//         }
//     });
// });

router.post('/createPost', auth, function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var ownerName = req.body.ownerName;
    var ownerEmail = req.payload.email;
    var skills = req.body.skills;
    var date = req.body.date;

    var postList = [];

    var params = {
        TableName : process.env.USERS_TABLE,
        Key : { 
          "Email" : {'S' : ownerEmail}
        }
    };

    database.getItem(params, function(err, data) {
        if (err) {
            res.status(500).end();
        } else {
            postList = JSON.parse(data.Item.Posts.S);
            var arr = [ownerEmail]; 
            var members = JSON.stringify(arr);
            
            var postItem = {
                'Name': {'S': name},
                'Description' : {'S' : description},
                'OwnerName': {'S': ownerName},
                'OwnerEmail': {'S': ownerEmail},
                'Skills': {'S': skills},
                'Date': {'S': date},
                'Members': {'S' : members},
                'Comments': {'S': []},
                'Likes': {'S': []}
            };
        
            var postParams = { 
                'TableName': process.env.POSTS_TABLE,
                'Item': postItem,
                'ConditionExpression': 'attribute_not_exists(#n)',
                ExpressionAttributeNames: {
                    "#n": "Name"
                }, 
            };

            database.putItem(postParams, function(err, data) {
                if (err) {
                    console.log(err);
                    var returnStatus = 500;
        
                    if (err.code === 'ConditionalCheckFailedException') {
                        returnStatus = 401;
                    }
        
                    res.status(returnStatus).end();
                } else {
                    postList.push(name);

                    var userParams = {
                        ExpressionAttributeNames: {
                         "#C": "Posts"
                        }, 
                        ExpressionAttributeValues: {
                         ":c": {
                           'S': JSON.stringify(postList)
                          }
                        }, 
                        Key: {
                         "Email": {
                           'S': ownerEmail
                          }
                        }, 
                        TableName: process.env.USERS_TABLE, 
                        UpdateExpression: "SET #C = :c"
                    };
                
                    database.updateItem(userParams, function(err, data) {
                        if (err) {
                            res.status(500).end();
                        } else {
                            res.status(200).end();
                        }
                    });   
                }
            });
        }
    });
});

router.post('/updatePost', auth, function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var skills = req.body.skills;
    var members = req.body.members;
    var comments = req.body.comments;
    var likes = req.body.likes;
    
    var params = {
        ExpressionAttributeNames: {
         "#C": 'Description',
         '#S': 'Skills',
         '#M': 'Members',
         '#CM': 'Comments',
         '#L': 'Likes'
        }, 
        ExpressionAttributeValues: {
         ":c": {
           'S': description
          },
          ":s": {
            'S': skills
          },
          ":m": {
            'S': members
          },
          ":cm": {
            'S': comments
          },
          ":l": {
            'S': likes
          }
        }, 
        Key: {
         "Name": {
           'S': name
          }
        }, 
        TableName: process.env.POSTS_TABLE, 
        UpdateExpression: "SET #C = :c, #S = :s, #M = :m, #CM = :cm, #L = :l"
    };

    database.updateItem(params, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });  
});

router.get('/comments', auth, function (req, res) {
    var name = req.query.name;
    console.log("Name: ", name);
    var params = {
        AttributesToGet: [
            "Comments"
        ],
        TableName : process.env.POSTS_TABLE,
        Key : { 
          "Name" : {'S' : name}
        }
    };

    database.getItem(params, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
             /* No user with that email found */
             console.log("data.Item: ", data.Item);
             if (data.Item === undefined) {
                console.log("MISTAKE!");
                res.status(401).end();
                return;
            } 
            res.json({
                comments: JSON.parse(data.Item.Comment.S)
            });
        }
    });
});

router.get('/likes', auth, function (req, res) {
    var name = req.query.name;
    var params = {
        AttributesToGet: [
            "Likes"
        ],
        TableName : process.env.POSTS_TABLE,
        Key : { 
          "Name" : {'S' : name}
        }
    };

    database.getItem(params, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
             /* No user with that email found */
             if (data.Item === undefined) {
                res.status(401).end();
                return;
            } 
            res.json({
                likes: JSON.parse(data.Item.Likes.S)
            });
        }
    });
});

router.post('/deletePost', auth, function(req, res) {
    var postList = [];

    var params = {
        TableName : process.env.USERS_TABLE,
        Key : { 
          "Email" : {'S' : req.payload.email}
        }
    };

    database.getItem(params, function(err, data) {
        if (err) {
            res.status(500).end();
        } else {
            postList = JSON.parse(data.Item.Posts.S); 

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
                    postList.splice(postList.indexOf(req.body.name));

                    var userParams = {
                        ExpressionAttributeNames: {
                         "#C": "Posts"
                        }, 
                        ExpressionAttributeValues: {
                         ":c": {
                           'S': JSON.stringify(postList)
                          }
                        }, 
                        Key: {
                         "Email": {
                           'S': req.payload.email
                          }
                        }, 
                        TableName: process.env.USERS_TABLE, 
                        UpdateExpression: "SET #C = :c"
                    };
                
                    database.updateItem(userParams, function(err, data) {
                        if (err) {
                            res.status(500).end();
                        } else {
                            res.status(200).end();
                        }
                    });   
                }
            });
        }
    });
});

router.post('/apply', auth, function(req, res) {
    mailer.sendApplication(req.body.owner, req.body.applicant);
    res.status(200).end();
});

router.post('/invite', auth, function(req, res) {
    mailer.sendInvitation(req.body.owner, req.body.invite, req.body.project);
    res.status(200).end();
});

router.post('/comment', auth, function(req, res) {
    //mailer.sendComment(req.body.owner, req.body.invite, req.body.project);
    res.status(200).end();
});

router.post('/like', auth, function(req, res) {
    //mailer.sendLike(req.body.owner, req.body.invite, req.body.project);
    res.status(200).end();
});

module.exports = router;