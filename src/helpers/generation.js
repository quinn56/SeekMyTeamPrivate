var uuid = require("../app").uuid;

function generateId() {
    return uuid.v1();
}

module.exports.generateId = generateId;