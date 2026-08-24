import express from 'express';
import { getTrainers, createTrainer } from '../controllers/trainerController.js';

const router = express.Router();

// GET /api/v1/trainers
router.get('/', getTrainers);

// POST /api/v1/trainers
router.post('/', createTrainer);

export default router;
