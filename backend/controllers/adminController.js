import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sunrise_modhera_resort_jwt_secret_key_2026_secure';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'sunrise@123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sunrise_001';

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'User ID and Password are required.' });
    }

    // Secure server-side credential verification
    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid User ID or Password.' });
    }

    // Sign a secure JWT token valid for 7 days
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during authentication', error: error.message });
  }
};

export const verifySession = async (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.admin
  });
};
