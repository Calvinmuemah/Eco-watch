import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email using the provided form data.
 * @param {object} formData - Object containing name, email, and message
 * @returns {Promise} - Resolves when the email is sent successfully
 */

const sendContactEmail = (formData) => {

    const { name, email, message } = formData;

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h2>Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong>${message}</p>
        `
    }

    return transporter.sendMail(mailOptions);

};

export default sendContactEmail;