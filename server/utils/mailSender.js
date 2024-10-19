import nodemailer from "nodemailer";
import { config } from 'dotenv';
config();

export const mailsender = async (email, subject, htmlContent) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `PayZoid <${process.env.EMAIL}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        };

        let info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
}