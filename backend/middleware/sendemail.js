const sgMail = require("@sendgrid/mail");
const { text } = require("express");

sgMail.setApiKey("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")

const sendEmail = (to, from, subject, text) => {
    const msg = {
        to,
        from,
        subject,
        html: text,
    }

    sgMail.send(msg, function(err, info) {
        if (err) {
            console.log("email not send");
            return err;
        } else {
            console.log("email send");
            return console.log("email send")
        }
    })
}
module.exports = sendEmail;