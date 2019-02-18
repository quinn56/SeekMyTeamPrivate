var database = require('../app').database;

function User(email, name) {
    this.email = email;
    this.name = name;
    this.description = '';
    //this.skills = []; use in future
    //this.picture = picture; use in future
}

/* TRASH DELETE DELETE DELETE */
User.prototype.updateDescription = function(description) {
    this.description = description;

    var params = {
        TableName: "Users",
        Key: {
            'Email' : this.email
        },
        UpdateExpression: "set Description = :description",
            ExpressionAttributeValues:{
                ":description":description
            }
    };
    
    database.updateItem(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
    });
}

function summarize(item) {
    return {
        'email': item.Email,
        'name': item.Name,
        'description': item.Description
    };
}

module.exports = User;
module.exports.summarize = summarize;