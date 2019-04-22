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
    text: 'Hi ' + owner + ',\n' + applicant + ' has applied to your project post. ' +
    'View their profile to see if they are a good fit here: http://seekmyteam.com/profile/'+applicant 
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

function sendInvitation(owner, invite, project) {
  const data = {
    from: 'postmaster@mg.seekmyteam.com',
    to: invite,
    subject: 'SeekMyteam - You have been invited to a project!',
    text: 'Hi ' + invite + ',\n' + owner + ' has invited you to work on: ' + project + 
    '\nCheck out their profile and the project on https://seekmyteam.com to see if you are interested.'  
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
module.exports.sendInvitation = sendInvitation;