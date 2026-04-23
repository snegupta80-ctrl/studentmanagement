const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management');
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'sneha@test.com' });
    if (existingUser) {
      console.log('User already exists!');
      console.log('Email: sneha@test.com');
      console.log('Password: 123456');
      process.exit(0);
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    const newUser = new User({
      name: 'Sneha',
      email: 'sneha@test.com',
      password: hashedPassword,
      role: 'admin'
    });

    await newUser.save();
    console.log('✅ Test user created successfully!');
    console.log('Email: sneha@test.com');
    console.log('Password: 123456');
    console.log('\nGo to http://localhost:5173/login and login with these credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createTestUser();
