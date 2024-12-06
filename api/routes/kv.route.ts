import express from "express";
import expressAsyncHandler from "express-async-handler";

import env from "../config/env";
import { sendMail } from "../config/mail";
import { errorHandler } from "../utils/logger";

const kv = express.Router();

const myemail = env.EMAIL_ID as string;

kv.post(
  "/mail",
  expressAsyncHandler(async (req, res): Promise<any> => {
    let { name, email, message } = req.body;

    const mailOptionsToMe = {
      from: `"Karthikeya Veruturi" <${myemail}>`,
      to: myemail,
      subject: "New mail received",
      html: `<p>A new mail has been received through website itskv.me from:</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Email:</strong> ${email}</li></ul><p>The message is:</p><blockquote>"${message}"</blockquote>`,
    };

    try {
      const toMe = await sendMail(mailOptionsToMe);
      if (toMe.success)
        return res.send({ success: true, message: "Mail sent successfully" });

      return res.send({ success: false, message: "Mail not sent" });
    } catch (error) {
      errorHandler(error, "kvApp-post");
    }
  })
);

export { kv };
