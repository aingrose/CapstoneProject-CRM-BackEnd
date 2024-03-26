 import nodemailer from "nodemailer";
 




var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'maheshrdrv@gmail.com',
    pass: 'gpzozkacjhysjwyl'
  }
});

var mailOptions = {
  from: '20eel10@kpriet.ac.in',
  to: 'maheshrdrv@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'hey hi how are you!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});