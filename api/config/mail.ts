import nodemailer from "nodemailer";
import env from "./env";
import { MailOptionTypes } from "../utils/types";

const sendMail = async (mailOptions: MailOptionTypes) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_ID,
      pass: env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

export { sendMail };
