import express from "express";
import expressAsyncHandler from "express-async-handler";
import env from "../config/env";
import { randomString } from "../utils/random";
import { sendMail } from "../config/mail";
import { errorHandler } from "../utils/logger";

const router = express.Router();

const myemail = env.EMAIL_ID as string;

router.post("/me", async (req, res) => {
  let { name, email, message } = req.body;
  const id = randomString(4);

  const mail = {
    name,
    email,
    message,
    id,
    createdAt: new Date(),
  };

  const mailOptionsToUser = {
    from: `"Karthikeya Veruturi" <${myemail}>`,
    to: email,
    subject: "Thanks for reaching out!",
    html: `<h1>Hello ${name}</h1><p>Thank you for reaching out. I have received your message:</p><blockquote>"${message}"</blockquote><p>I will get back to you shortly.</p><br>Best regards,<br>Karthikeya Veruturi<br><i>This is an automated email by nodemailer</i>`,
  };

  const mailOptionsToMe = {
    from: `"Karthikeya Veruturi" <${myemail}>`,
    to: myemail,
    subject: "New mail received",
    html: `<h1>Hello Karthikeya</h1><p>A new mail has been received from:</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Email:</strong> ${email}</li></ul><br><p>The message is:</p><blockquote>"${message}"</blockquote>`,
  };

  try {
    const toUser = await sendMail(mailOptionsToUser);
    const toMe = await sendMail(mailOptionsToMe);
    if (toUser.success && toMe.success)
      return res.send({ message: "Mail received" });
    return res.send({
      message: "Mail not received",
      payload: { toUserErr: toUser.error, toMeErr: toMe.error },
    });
  } catch (error) {
    errorHandler(error, "kvApp-post");
  }
});

export default router;
