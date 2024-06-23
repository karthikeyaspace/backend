const nodemailer = require('nodemailer');

const sendMail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return { success: true, message: "Mail sent", info };
    } catch (error) {
        console.error("Error sending email: ", error);
        return { success: false, message: "Mail not sent", error };
    }
};

module.exports = { sendMail };
