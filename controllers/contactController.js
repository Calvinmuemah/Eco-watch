import sendContactEmail from '../utils/mailer.js';

const submitContactForm = async (req, res) => {
    try {
        
        const formData = req.body;

        const info = await sendContactEmail(formData);

        console.log('Message sent: %s', info.messageId); //%s is a placeholder for string value
        res.status(200).json({ msg: 'Your message has been sent successfully' });

    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ msg: 'Failed to send your message. Please try again later.' });
    }
};

export default submitContactForm;