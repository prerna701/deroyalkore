import nodemailer from 'nodemailer';
import assert from 'node:assert';
import dotenv from 'dotenv';
import path from 'path';

// Load variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runTest() {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: 'prernaarora384@gmail.com',
            to: 'prernaarora384@gmail.com',
            subject: 'Test Email - Appointment System',
            text: 'This is a test email to verify the SMTP credentials for the Krish Site appointment system.',
        });

        assert.ok(info.messageId, 'Email should have a messageId after being sent');
        console.log('Test email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Failed to send email:', error);
        process.exit(1);
    }
}

runTest();
