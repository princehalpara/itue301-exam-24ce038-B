import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';

/**
 * Generate signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fitzone_jwt_secret_key_24CE038_exam_b',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * @desc    Member Login / Onboarding
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginMember = async (req, res, next) => {
  try {
    const { email, name, membershipType } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address to log in',
      });
    }

    // Find existing member by email
    let member = await Member.findOne({ email: email.toLowerCase().trim() });

    // If member does not exist yet, automatically onboard them with name or default name
    if (!member) {
      const memberName = name && name.trim() ? name.trim() : email.split('@')[0];
      const validMembership = ['basic', 'premium', 'platinum'].includes(membershipType)
        ? membershipType
        : 'basic';

      member = await Member.create({
        name: memberName,
        email: email.toLowerCase().trim(),
        membershipType: validMembership,
      });
    }

    // Generate token
    const token = generateToken(member._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      member: {
        _id: member._id,
        name: member.name,
        email: member.email,
        membershipType: member.membershipType,
        createdAt: member.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current Logged in Member Profile
 * @route   GET /api/v1/auth/me
 * @access  Private (authGuard)
 */
export const getMe = async (req, res, next) => {
  try {
    const member = await Member.findById(req.member._id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};
