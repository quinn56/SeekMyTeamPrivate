const mg = require("../app").mg;

function sendCode(email, code) {
    const data = {
        from: 'postmaster@sandboxe1aea5edfa8f4904b65d4facc650f8c2.mailgun.org',
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