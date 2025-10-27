import { sendEmail } from './emailProvider.js';
import { sendSms } from './smsProvider.js';

// Central function to handle all notification types/channels
export async function sendAlert(recipient) {
    const { phone, email, message, subject } = recipient;

    const emailPromise = email 
        ? sendEmail(email, subject, `<p>${message}</p>`) 
        : Promise.resolve({ success: false, message: 'No email provided' });

    const smsPromise = phone 
        ? sendSms(phone, message) 
        : Promise.resolve({ success: false, message: 'No phone provided' });

    // Wait for both to complete
    const [emailResult, smsResult] = await Promise.all([emailPromise, smsPromise]);
    
    return { 
        emailStatus: emailResult, 
        smsStatus: smsResult 
    };
}

