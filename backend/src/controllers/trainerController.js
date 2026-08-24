import Trainer from '../models/Trainer.js';

/**
 * @desc    Get all trainers
 * @route   GET /api/v1/trainers
 * @access  Public
 */
export const getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new trainer (Optional helper / admin utility)
 * @route   POST /api/v1/trainers
 * @access  Public / Admin
 */
export const createTrainer = async (req, res, next) => {
  try {
    const { name, specialization, available, experienceYears, bio, avatar } = req.body;

    const trainer = await Trainer.create({
      name,
      specialization,
      available: available !== undefined ? available : true,
      experienceYears: experienceYears || 3,
      bio: bio || '',
      avatar: avatar || '',
    });

    res.status(201).json({
      success: true,
      message: 'Trainer created successfully',
      data: trainer,
    });
  } catch (error) {
    next(error);
  }
};
