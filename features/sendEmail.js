require("dotenv").config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function SendEmail(email) {
    const msg = {
        to: email,
        from: "rockssical@gmail.com",
        subject: "Welcome to iCrowdTask",
        html: "Hello world, welcome to this task!"
    }

    async function send() {
        try {
            await sgMail.send(msg);
            console.log("Email was sent");
        } catch (er) {
            console.log(err);
        }
    }
    send();
}

module.exports = SendEmail;