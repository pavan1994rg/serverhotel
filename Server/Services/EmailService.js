const nodemailer = require('nodemailer');
const emailConfig = require('../utility/emailConfig');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');

module.exports = class EmailService {
    constructor(){

    }
    sendEmail(recieverEmailId,body){
      console.log(emailConfig.senderEmailId);
    return  new Promise(function(resolve,reject){
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: emailConfig.senderEmailId,
                pass: emailConfig.senderPassword
            }
        }));

        var mailOptions = {
            from: emailConfig.senderEmailId,
            to: recieverEmailId,
            subject: 'Order Invoice',
            html: body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return reject(info);
            } else {
                console.log('email sent', +info.response);
              return resolve(info);
            }
        });
      })

    }
}
