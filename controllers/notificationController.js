import { sendAlert } from '../services/notificationService.js';

export const sendNotification = async (req, res) => {
    const { phone, email, subject, message } = req.body;

    if (!phone && !email) {
        return res.status(400).json({ error: 'At least a phone number or email is required.' });
    }
    
    try {
        const results = await sendAlert({ phone, email, subject, message });

        // Check if both failed
        if (!results.emailStatus.success && !results.smsStatus.success) {
            return res.status(500).json({ 
                message: 'Notification failed on both channels.',
                details: results
            });
        }

        res.status(200).json({
            message: 'Notification processing complete.',
            results
        });

    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({ error: 'Internal server error during notification dispatch.' });
    }
};