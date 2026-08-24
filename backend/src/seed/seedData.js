import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trainer from '../models/Trainer.js';
import Member from '../models/Member.js';
import ClassBooking from '../models/ClassBooking.js';

dotenv.config();

const sampleTrainers = [
  {
    name: 'Marcus Vance',
    specialization: 'Strength & Conditioning',
    available: true,
    experienceYears: 6,
    bio: 'Certified CSCS coach specializing in barbell mechanics, powerlifting, and athletic conditioning.',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Elena Rostova',
    specialization: 'Yoga & Flexibility',
    available: true,
    experienceYears: 8,
    bio: 'Vinyasa flow and restorative mobility specialist helping members improve flexibility and core stability.',
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Liam Gallagher',
    specialization: 'HIIT & CrossFit',
    available: false, // Fully booked demo
    experienceYears: 5,
    bio: 'High-intensity interval trainer focusing on metabolic conditioning and functional circuit training.',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Chloe Bennett',
    specialization: 'Pilates & Core Dynamics',
    available: true,
    experienceYears: 4,
    bio: 'Reformer & mat Pilates instructor dedicated to posture alignment and deep abdominal activation.',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'David Kim',
    specialization: 'Bodybuilding & Nutrition',
    available: true,
    experienceYears: 7,
    bio: 'Hypertrophy coach and sports nutritionist preparing athletes for peak physique and strength gains.',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Aria Montgomery',
    specialization: 'Cardio Kickboxing',
    available: false, // Fully booked demo
    experienceYears: 6,
    bio: 'Martial arts enthusiast and cardiovascular conditioning expert delivering high-energy combat sessions.',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
];

const sampleMembers = [
  {
    name: 'Prince Halpara',
    email: 'prince.halpara@fitzone.edu',
    membershipType: 'platinum',
  },
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    membershipType: 'premium',
  },
  {
    name: 'Samantha Lee',
    email: 'sam.lee@example.com',
    membershipType: 'basic',
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitzone_db';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing trainers and members...');
    await Trainer.deleteMany({});
    await Member.deleteMany({});
    await ClassBooking.deleteMany({});

    console.log('[Seed] Inserting sample trainers...');
    const createdTrainers = await Trainer.insertMany(sampleTrainers);
    console.log(`[Seed] Successfully inserted ${createdTrainers.length} trainers.`);

    console.log('[Seed] Inserting sample members...');
    const createdMembers = await Member.insertMany(sampleMembers);
    console.log(`[Seed] Successfully inserted ${createdMembers.length} members.`);

    // Create a sample booking for the demo member
    console.log('[Seed] Creating demo booking...');
    await ClassBooking.create({
      memberId: createdMembers[0]._id,
      trainerId: createdTrainers[0]._id,
      date: '2026-08-26',
      timeSlot: '09:00 AM - 10:00 AM',
      notes: 'Initial strength assessment workout',
      status: 'booked',
    });

    console.log('✅ [Seed] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
