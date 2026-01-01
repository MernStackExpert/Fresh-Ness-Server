const transporter = require("../config/nodemailer"); 
require("dotenv").config();

const sendOrderEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"FreshNess Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email in utility: ", error.message);
    throw error; 
  }
};

module.exports = sendOrderEmail;