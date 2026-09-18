import express from 'express';
import { adminLogin, verifySession } from '../controllers/adminController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public login endpoint
router.post('/login', adminLogin);

// Protected token verification endpoint
router.get('/verify', verifyAdminToken, verifySession);

export default router;
