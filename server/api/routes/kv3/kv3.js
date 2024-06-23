const express = require('express')
const kvApp = express.Router()
const randomString = require('../shorten/utils/randomString.js')
const asyncHandler = require('express-async-handler')
const { uploadData } = require('../../libs/firebase.js')
const { errorHandler } = require('../../helpers/helper.js')
const { sendMail } = require('../../helpers/sendMail.js')

const myemail = process.env.EMAIL_USER

kvApp.post('/mailme', asyncHandler(async (req, res) => {
    let { name, email, message } = req.body;
    const id = randomString(4);

    const mail = {
        name,
        email,
        message,
        id,
        createdAt: new Date()
    };

    const mailOptionsToUser = {
        from: `"Karthikeya Veruturi" <${myemail}>`,
        to: email,
        subject: "Thanks for reaching out!",
        text: `Hello ${name},\n\nThank you for reaching out. I have received your message. "`,
        html: `<h1>Hello ${name}</h1><p>Thank you for reaching out. I have received your message:</p><blockquote>"${message}"</blockquote><p>I will get back to you shortly.</p><br>Best regards,<br>Karthikeya Veruturi<br><i>This is an automated email by nodemailer</i>`
    };
    

    const mailOptionsToMe = {
        from: `"Karthikeya Veruturi" <${myemail}>`,
        to: myemail,
        subject: "New mail received",
        text: `Hello Karthikeya,\n\nA new mail has been received from ${name} with email ${email}. The message is: "${message}".\n\nMail ID: ${id}`,
        html: `<h1>Hello Karthikeya</h1><p>A new mail has been received from:</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Email:</strong> ${email}</li></ul><br><p>The message is:</p><blockquote>"${message}"</blockquote>`
    };
    

    try {
        const toUser = await sendMail(mailOptionsToUser);
        const toMe = await sendMail(mailOptionsToMe);

        if (toUser.success && toMe.success) {
            await uploadData(process.env.FIREBASE_MAILME_COLL_NAME, mail);
            return res.send({ message: "Mail received", payload: { toUser: toUser.info, toMe: toMe.info } });
        }

        return res.send({ message: "Mail not received", payload: { toUserErr: toUser.error, toMeErr: toMe.error } });
    } catch (err) {
        errorHandler(err, 'kvApp-post');
    }
}));


module.exports = kvApp