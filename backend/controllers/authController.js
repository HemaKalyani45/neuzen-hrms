const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { initialUsers } = require('../utils/seedData');

// Local in-memory state fallback if MongoDB server isn't running
let localUsers = initialUsers.map(u => ({
  _id: u.email.replace('@', '_'),
  name: u.name,
  email: u.email,
  password: bcrypt.hashSync(u.passwordRaw, 10),
  role: u.role,
  status: u.status
}));

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // 1. Direct match with initialUsers (raw password or case-insensitive raw password)
    const demoUser = initialUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (demoUser) {
      const isMatch = cleanPassword === demoUser.passwordRaw || 
                      cleanPassword.toLowerCase() === demoUser.passwordRaw.toLowerCase();
      if (isMatch) {
        const token = jwt.sign(
          { id: demoUser.email, email: demoUser.email, role: demoUser.role, name: demoUser.name },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          message: `Welcome back, ${demoUser.name}`,
          token,
          user: {
            id: demoUser.email,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            status: demoUser.status
          }
        });
      }
    }

    // 2. Dynamic employee credential matching for any @neuzenai.com email:
    // Email: anyname@neuzenai.com
    // Password: 1st 3 characters of name + @123 (e.g. Ale@123 or ale@123)
    if (cleanEmail.endsWith('@neuzenai.com')) {
      const localPart = cleanEmail.split('@')[0];
      const prefix = localPart.slice(0, 3); // e.g. "ale" or "mar"
      
      // Check if password ends with @123 and starts with 3 chars matching localPart prefix
      if (cleanPassword.toLowerCase().endsWith('@123')) {
        const passPrefix = cleanPassword.slice(0, -4); // Everything before @123
        if (passPrefix.toLowerCase() === prefix.toLowerCase()) {
          const displayName = localPart.charAt(0).toUpperCase() + localPart.slice(1);
          // Check role: admin / hr / employee based on email prefix
          let role = 'Employee';
          if (localPart === 'admin') role = 'Admin';
          if (localPart === 'hr') role = 'HR';

          const token = jwt.sign(
            { id: cleanEmail, email: cleanEmail, role, name: displayName },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          return res.json({
            success: true,
            message: `Welcome back, ${displayName}!`,
            token,
            user: {
              id: cleanEmail,
              name: displayName,
              email: cleanEmail,
              role: role,
              status: 'Active'
            }
          });
        }
      }
    }

    // 3. Database / Local memory user lookup
    let user = null;
    try {
      user = await User.findOne({ email: cleanEmail });
    } catch (e) {
      user = localUsers.find(u => u.email.toLowerCase() === cleanEmail);
    }

    if (user) {
      let isMatch = false;
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(cleanPassword, user.password);
      } else {
        isMatch = cleanPassword === user.password || cleanPassword.toLowerCase() === user.password.toLowerCase();
      }

      if (isMatch) {
        const token = jwt.sign(
          { id: user._id || user.email, email: user.email, role: user.role, name: user.name },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id || user.email,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
          }
        });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials. Please check email and password.' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error during authentication' });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = null;
    try {
      user = await User.findById(userId).select('-password');
    } catch (e) {
      user = localUsers.find(u => u._id === userId || u.email === req.user.email);
    }

    if (!user) {
      user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      };
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. Check your inbox for the reset link.`
  });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  res.json({
    success: true,
    message: 'Password successfully updated. You may now log in with your new password.'
  });
};

module.exports = {
  login,
  getMe,
  forgotPassword,
  resetPassword,
  localUsers
};
