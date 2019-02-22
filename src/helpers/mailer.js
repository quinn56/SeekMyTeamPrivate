const mg = require("../app").mg;

function sendCode(email, code) {
    const data = {
        from: 'verify@mg.seekmyteam.com',
        to: email,
        subject: 'SeekMyTeam Verification Code',
        text: 'Hello, your verification code is: ' + code 
    };
    mg.messages().send(data, function (err, body) {
      if(err) {
        console.log(err);
        return false;
      }
      else
        return true;
    });
}

module.exports.sendCode = sendCode;