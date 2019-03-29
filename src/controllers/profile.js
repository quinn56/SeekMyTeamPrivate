var express = require("express");
var router = express.Router();
var path = require("path");
var s3 = require('../app').s3;
var User = require("../models/User");
var database = require('../app').database;
var jwt = require('express-jwt');
const fileType = require('file-type');


var auth = jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: 'payload'
});

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

router.get('/:email/pic', auth, function(req, res) {
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
            var image = data.Item.Image.S;
            res.status(200).json({
                "image": image
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

    var params = {
        ExpressionAttributeNames: {
         "#C": "Description",
         "#S": 'Skills',
         "#F": 'Facebook',
         "#L": 'Linkedin'
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
        }, 
        Key: {
         "Email": {
           'S': email
          }
        }, 
        TableName: process.env.USERS_TABLE, 
        UpdateExpression: "SET #C = :c, #S = :s, #F = :f, #L = :l"
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
/*
router.post('/uploadPicture', auth, function(req, res) {
    //get the image data from upload
    const image = req.body.image;

    const fileBuffer = Buffer.from(image, 'base64');
    const fileTypeInfo = fileType(fileBuffer);

    //validate image is on right type
    if (fileBuffer.length < 500000 && imageTypes.includes(fileTypeInfo.mime)) {
        // upload it to s3 with unix timestamp as a file name
        const fileName = req.payload.email + '/pic'
        
        const bucket = process.env.BUCKET;
        const params = {
            Body: fileBuffer,
            Key: fileName,
            Bucket: bucket,
            ContentEncoding: 'base64',
            ContentType: fileTypeInfo.mime
        };

        s3.putObject(params, (err, data) => {
            if (err) {
                console.log(err);
                res.status(400);
            } 
            res.status(200).end()
        });
    } else {
        res.status(401).end();
    }
});*/

router.post('/uploadPicture', auth, function(req, res) {
    const image = req.body.image;
    const email = req.payload.email;

    var params = {
        ExpressionAttributeNames: {
         "#C": "Image",
        }, 
        ExpressionAttributeValues: {
         ":c": {
           'S': image
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
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });  
});

module.exports = router;