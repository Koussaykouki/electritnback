// routes/contactRoutes.js

const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Configure the email transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Or another email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  // Email options
  let mailOptions = {
    from: email, // Sender's email
    to: process.env.RECIPIENT_EMAIL, // Your email address where you want to receive the form submissions
    subject: 'New Contact Form Submission',
    text: `You have received a new message from ${name} (${email}):\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending message');
  }
});

module.exports = router;
