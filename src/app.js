const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Adjust the path if necessary
const productRoutes = require('./routes/productRoutes'); // Add this line
const path = require('path');
const contactRoutes = require('./routes/contactRoutes'); // Import the contact routes

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8081', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent with requests
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Add this line
app.use('/api', contactRoutes); // Adjust the path as necessary


// Serve static files (for uploaded images and PDF files)
app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
