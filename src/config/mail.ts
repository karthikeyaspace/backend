import nodemailer from "nodemailer";
import env from "./env";

export interface MailOptionTypes {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (mailOptions: MailOptionTypes) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_ID,
      pass: env.EMAIL_PASS,
    },
  });

  try {
    const mail = await transporter.sendMail(mailOptions);
    return { success: true, message: "Mail sent sucessfully" };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, message: "Mail not sent", error };
  }
};

export { sendMail };
