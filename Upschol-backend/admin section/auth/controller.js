const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/Usermodels');
const SECRET = 'your_jwt_secret';

// Hardcoded admin credentials
const hardcodedAdmin = {
  email: 'admin@admin.com',
  password: 'admin123',
};

// LOGIN API
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check hardcoded admin
  if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
    const token = jwt.sign({ role: 'admin', email }, SECRET, { expiresIn: '1h' });
    return res.json({ token, role: 'admin', email });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE USER API
exports.createUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const creator = req.user;

  // Authorization checks
  if (creator.role === 'sales') {
    return res.status(403).json({ error: 'Sales cannot create users' });
  }

  if (creator.role === 'subadmin' && role !== 'sales') {
    return res.status(403).json({ error: 'Subadmin can only create sales' });
  }

  try {
    // Check if user exists by email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Check if user exists by phone
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(409).json({ error: 'User with this phone number already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
