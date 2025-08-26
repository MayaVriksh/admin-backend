const nodemailer = require("nodemailer");
const {
    COMPANY_NAME,
    SUPPORT_EMAIL
} = require("../constants/business.constants");
const { AUTH } = require("../constants/emailSubjects.constants");
const welcomeTemplate = require("../email-templates/users/welcome.template");
require("dotenv").config();

// =============================
// Gmail Transporter Configuration
// =============================
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    secure: process.env.EMAIL_SECURE === "true", // SSL for 465
    auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS // Gmail App Password
    }
});

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "MISSING");

// =============================
// Generic Send Email Function with Retry
// =============================
const sendEmail = async (to, subject, html, retries = 2) => {
    let attempt = 0;

    while (attempt <= retries) {
        try {
            const info = await transporter.sendMail({
                from: `"${COMPANY_NAME}" <${SUPPORT_EMAIL}>`,
                to,
                subject,
                html
            });

            // Gmail does not provide preview links like Ethereal
            console.log(
                `✅ Email sent to ${to} | Subject: ${subject} | MessageID: ${info.messageId}`
            );
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(
                `❌ Attempt ${attempt + 1} failed to send email:`,
                error
            );

            // Gmail sometimes blocks temporarily; wait before retrying
            if (attempt === retries) return { success: false, error };
            attempt++;
            await new Promise((res) => setTimeout(res, 2000 * attempt)); // exponential backoff
        }
    }
};

// =============================
// Optional Queue for Batch Emails
// =============================
const emailQueue = [];
const queueEmail = (emailOptions) => emailQueue.push(emailOptions);

const processQueue = async () => {
    while (emailQueue.length > 0) {
        const email = emailQueue.shift();
        await sendEmail(email);
    }
};

module.exports = { sendEmail, queueEmail, processQueue };

// =============================
// Example: Send a test email
// =============================
// (async () => {
//     const result = await sendEmail(
//         "testingmine87@gmail.com",
//         AUTH.ACCOUNT_VERIFIED,
//         welcomeTemplate({ name: "SAKET" })
//     );
//     console.log(result);
// })();
