const prisma = require('../../prisma/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email or username' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });


    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        xp: newUser.xp,
        level: newUser.level,
      },
      token,
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('🔐 Login attempt received:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('🔍 Finding user with email:', email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.username);
    console.log('🔑 Comparing password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', user.username);
      return res.status(401).json({ message: 'Invalid password' });
    }

    console.log('✅ Password valid!');
    // NOTE: lastLogin field needs to be added to database manually
    // TODO: Uncomment after running: ALTER TABLE users ADD COLUMN    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    console.log('🍪 Setting cookie with token...');
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    console.log('✅ Login successful, sending response...');
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
      },
      token,
    });
  } catch (error) {
    console.error('❌ Login Error Details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};