const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema');
const jwt = require('jsonwebtoken')

router.post('/createUser', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  // Check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // Generate JWT token
    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: '6h' });
  
    res.status(200).json({ token });
  });

module.exports = router;