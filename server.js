import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js'; // Adjust if default export vs named

const PORT = process.env.PORT;

// Connect to database
connectDB();

// Start the server
const server = app.listen(PORT, () => {
    console.log(`eco watch backend is running on port ${PORT}`);
    console.log(`environment: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err.message);
    server.close(() => process.exit(1));
});
