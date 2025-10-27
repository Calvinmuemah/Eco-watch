import dotenv from 'dotenv'
dotenv.config();
import  AfricasTalking from 'africastalking';

// Initialize Africa's Talking
const at = AfricasTalking({
    username: process.env.AT_USERNAME,
    apiKey: process.env.AT_API_KEY
});

/**
*@param {string} to - +254705162766 
*@param {string} message - The message body. 
*/

export async function sendSms(to, message) {
    const options = {
        to: to,
        message: message,
        // from: `"ECO_WATCH" <${ process.env.EMAIL_USER }>`, 
    };

    try {
        const response = await at.SMS.send(options);
        console.log('SMS sent (AT):', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error sending SMS (AT):', error);
        return { success: false, error: error.message };
    }
}

