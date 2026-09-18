import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sunrise_modhera_resort_jwt_secret_key_2026_secure';

export const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token is missing.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session token. Please log in again.' });
  }
};
