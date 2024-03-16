// import nodemailer from "nodemailer";
// import asyncHandler from "../services/asyncHandler.js";
// import { config } from "dotenv";

// const sendMail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: config.SMTP_MAIL_HOST,
//     port: config.SMTP_MAIL_PORT,
//     auth: {
//       user: config.SMTP_MAIL_USERNAME,
//       pass: config.SMTP_MAIL_PASSWORD,
//     },
//   });

//   try {
//     const info = await transporter.sendMail(options);
//     console.log("Message sent: %s", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Email could not be sent");
//   }
// };

// export default asyncHandler(sendMail);
