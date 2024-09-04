const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log(`Register attempt for email: ${email}`);
  
      const newUser = new User({ username, email, password });
      const savedUser = await newUser.save();
      
      if (!savedUser) {
        console.error('User was not saved.');
        return res.status(400).json({ error: 'Error registering user.' });
      }
  
      console.log(`User registered: ${savedUser._id} - ${email}`);
      res.status(201).json({ message: 'User registered. Await activation by admin.' });
    } catch (error) {
      console.error(`Error registering user: ${error.message}`);
      res.status(400).json({ error: 'Error registering user.' });
    }
  });

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    
    const user = await User.findOne({ email });
    if (!user || !user.isActivated) {
      console.log(`Login failed for email: ${email} - Account not activated or invalid credentials.`);
      return res.status(400).json({ error: 'Account not activated or invalid credentials.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed for email: ${email} - Invalid credentials.`);
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log(`Login successful for email: ${email}`);
    res.json({ token });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    res.status(500).json({ error: 'Error logging in.' });
  }
});

// Activate User Route
router.post('/activate', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`Activation attempt for userId: ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`Activation failed: User not found with userId: ${userId}`);
      return res.status(404).json({ error: 'User not found.' });
    }
    
    user.isActivated = true;
    await user.save();
    
    console.log(`User activated successfully: userId: ${userId}`);
    res.json({ message: 'User activated successfully.' });
  } catch (error) {
    console.error(`Error activating user: ${error.message}`);
    res.status(500).json({ error: 'Error activating user.' });
  }
});
router.post('/deactivate', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`deactivation attempt for userId: ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`Activation failed: User not found with userId: ${userId}`);
      return res.status(404).json({ error: 'User not found.' });
    }
    
    user.isActivated = false;
    await user.save();
    
    console.log(`User activated successfully: userId: ${userId}`);
    res.json({ message: 'User activated successfully.' });
  } catch (error) {
    console.error(`Error activating user: ${error.message}`);
    res.status(500).json({ error: 'Error activating user.' });
  }
});
// Get all users (Example: Only admin can access this route)
router.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, '-password'); // Exclude password from the response
      res.json(users);
    } catch (error) {
      console.error(`Error fetching users: ${error.message}`);
      res.status(500).json({ error: 'Error fetching users.' });
    }
  });
  

module.exports = router;
