// authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/Users');
require('dotenv').config();

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(username);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async register(req, res) {
    try {
      // Destructure including role and adminCode from the request body.
      const { username, password, email, role, adminCode } = req.body;

      // Check if the username already exists.
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Only allow admin registration if a valid adminCode is provided.
      if (role === 'admin') {
        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
          return res.status(403).json({ message: 'Invalid admin code' });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // Use the supplied role (either 'user' or 'admin' if the admin code was valid)
      const userId = await User.create({ username, password: hashedPassword, email, role });
      res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = AuthController;