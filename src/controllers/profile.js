var express = require("express");
var router = express.Router();
var path = require("path");
var User = require("../models/User");
var database = require('../app').database;
var jwt = require('express-jwt');
const fileType = require('file-type');

var auth = jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: 'payload'
});

var s3 = require('../app').s3;
const multer = require('../app').multer;
const multers3 = require('../app').multers3;

const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: process.env.BUCKET,
        acl: 'public-read',
        contentType: multers3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, 'profile-pics/' + req.payload.email + '/picture');
        }
    })
});

const singleUpload = upload.single('image');

const imageTypes = [
    'image/gif',
    'image/jpeg',
    'image/png'
];

router.get('/:email', auth, function(req, res) {
    var email = req.params.email;
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
            var user = User.summarize(data.Item)
            res.status(200).json({
                "user": user
            });
        }
    });
});

router.post('/delete', auth, function(req, res) {
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

router.post('/update', auth, function(req, res) {   
    var email = req.payload.email;     
    
    var description = req.body.description;
    var skills = req.body.skills;
    var facebook = req.body.facebook;
    var linkedin = req.body.linkedin;
    var github = req.body.github

    var params = {
        ExpressionAttributeNames: {
         "#C": "Description",
         "#S": 'Skills',
         "#F": 'Facebook',
         "#L": 'Linkedin',
         "#G": 'Github'
        }, 
        ExpressionAttributeValues: {
         ":c": {
           'S': description
          },
          ":s": {
            'S': skills
          },
          ":f": {
            'S': facebook
          },
          ":l": {
            'S': linkedin
          },
          ":g": {
            'S': github
          },
        }, 
        Key: {
         "Email": {
           'S': email
          }
        }, 
        TableName: process.env.USERS_TABLE, 
        UpdateExpression: "SET #C = :c, #S = :s, #F = :f, #L = :l, #G = :g"
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

router.post('/uploadPicture', auth, function(req, res) {
    singleUpload(req, res, function(err, some) {
        if (err) {
            console.log('error uploading HERE');
          return res.status(405).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
        }
        console.log("image url: ", req.file.location);
        return res.json({'imageUrl': req.file.location});
      });
});

router.post('/markApplied', auth, function(req, res) {
    var email = req.payload.email;
    var project = req.body.project;

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
            var arr = JSON.parse(data.Item.AppliedPosts.S);
            
            /* Check for duplicates */
            arr.forEach(element => {
                if (JSON.parse(project).name === element.name) {
                    res.status(200).end();
                    return;
                }
            });

            arr.push(project);

            params = {
                ExpressionAttributeNames: {
                 "#C": "AppliedPosts",
                }, 
                ExpressionAttributeValues: {
                 ":c": {
                   'S': JSON.stringify(arr)
                  }
                }, 
                Key: {
                 "Email": {
                   'S': email
                  }
                }, 
                TableName: process.env.USERS_TABLE, 
                UpdateExpression: "SET #C = :c"
            };
        
            database.updateItem(params, function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                } else {
                    res.status(200).end();
                }
            });  
        }
    });
});

/* CODE TO DELETE ALL ENTITIES CREATED BY A USER
THIS CODE NEEDS AN UPDATE, BUT WORKS. MAY NOT BE THE DESIRED FUNCTIONALITY

router.post('/delete', function(req, res) {
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

module.exports = router;