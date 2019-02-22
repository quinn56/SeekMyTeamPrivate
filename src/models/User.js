function User(email, name) {
    this.email = email;
    this.name = name;
    this.description = '';
    //this.skills = []; use in future
    //this.picture = picture; use in future
}

function summarize(item) {
    return {
        'email': item.Email.S,
        'name': item.Name.S,
        'description': item.Description.S
    };
}

module.exports = User;
module.exports.summarize = summarize;