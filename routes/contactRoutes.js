import express from 'express';
import submitContactForm from '../controllers/contactController.js';
import validateContactForm from '../middlewares/mailValidation.js';

const router = express.Router();

router.post('/submit', validateContactForm, submitContactForm);

export default router;