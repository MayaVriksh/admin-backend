import nodemailer from 'nodemailer';
import { businessConstants } from '../constants/business.constants';
import * as ERROR_MESSAGES from '../constants/errorMessages.constant';
import { RESPONSE_CODES, RESPONSE_FLAGS } from '../constants/responseCodes.constant';
require("dotenv").config();

// =============================
// Gmail Transporter Configuration
// =============================
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || '465', 10) || 465,
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
                from: `"${businessConstants.COMPANY_NAME}" <${businessConstants.SUPPORT_EMAIL}>`,
                to,
                subject,
                html
            });

            console.log(
                `✅ Email sent to ${to} | Subject: ${subject} | MessageID: ${info.messageId}`
            );
            return info.messageId; // return only the messageId
        } catch (error) {
            console.error(
                `❌ Attempt ${attempt + 1} failed to send email:`,
                error
            );

            if (attempt === retries) {
                // Throw a structured error that can be caught in controller
                throw {
                    success: RESPONSE_FLAGS.FAILURE,
                    code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                    message: ERROR_MESSAGES.EMAIL.SEND_FAILED,
                    details: (error as any)?.message
                };
            }

            attempt++;
            await new Promise((res) => setTimeout(res, 2000 * attempt)); // exponential backoff
        }
    }
};

// =============================
// Optional Queue for Batch Emails
// =============================
const emailQueue: any[] = [];
const queueEmail = (emailOptions: any) => emailQueue.push(emailOptions);

const processQueue = async () => {
    while (emailQueue.length > 0) {
        const email = emailQueue.shift();
        // email is expected to be an object: { to, subject, html }
        if (email && typeof email === 'object') {
            await sendEmail(email.to, email.subject, email.html);
        }
    }
};

export { processQueue, queueEmail, sendEmail };

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

// (async () => {
//     const supplierDetails = await findSupplierDetailsForEmailByUserId(
//         "USER-25-DEC9957-0018"
//     );
//     console.log(supplierDetails?.contactPerson);
//     console.log(supplierDetails?.contactPerson?.fullName[FIRST_NAME]);
//     console.log(supplierDetails?.contactPerson?.email);

//     const result = await sendEmail(
//         "j6362254@gmail.com",
//         SUPPLIER.APPLICATION_RECEIVED,
//         supplierProfileSubmittedTemplate({
//             contactName: supplierDetails?.contactPerson?.fullName[FIRST_NAME],
//             nurseryName: supplierDetails?.nurseryName
//         })
//     );
//     console.log(result);
// })();
