const mg = require("../app").mg;

function sendCode(email, code) {
    const data = {
        from: 'postmaster@mg.seekmyteam.com',
        to: email,
        subject: 'SeekMyTeam Verification Code',
        text: 'Hello, your verification code is: ' + code 
    };
    mg.messages().send(data, function (err, body) {
      if(err) {
        console.log(err);
        return false;
      } else {
        return true;
      }
    });
}

function sendApplication(owner, applicant) {
  const data = {
    from: 'postmaster@mg.seekmyteam.com',
    to: owner,
    subject: 'SeekMyTeam - Someone applied to your project!',
    text: 'Hello, \n' + applicant + ' has applied to your project post. Go checkout their profile and see if they are a good fit here: ' 
  };
  
  mg.messages().send(data, function (err, body) {
    if(err) {
      console.log(err);
      return false;
    } else {
      return true;
    }
  });
}

module.exports.sendCode = sendCode;
module.exports.sendApplication = sendApplication;