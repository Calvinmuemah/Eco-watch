const validateContactForm = (req, res, next) => {

    const { name, email, message } = req.body;

    if(!name || !email || !message) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    next();

};

export default validateContactForm;