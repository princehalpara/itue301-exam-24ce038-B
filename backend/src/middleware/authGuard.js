import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';

/**
 * AuthGuard Middleware
 * Validates incoming Bearer token in Authorization header
 * Attaches member object to req.member
 */
export const authGuard = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided in Bearer format.',
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fitzone_jwt_secret_key_24CE038_exam_b'
    );

    // Find member by ID
    const member = await Member.findById(decoded.id).select('-__v');

    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Member not found for this token.',
      });
    }

    // Attach member to request
    req.member = member;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please login again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Authorization denied.',
    });
  }
};

export default authGuard;
