import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDb } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.model.js';
import { Gig } from '../src/models/Gig.model.js';
import { Bid } from '../src/models/Bid.model.js';

const seedData = async () => {
    try {
        console.log('Connecting to database...');
        await connectDb(env.mongoUri);
        console.log('Connected to database.');

        // Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Gig.deleteMany({}),
            Bid.deleteMany({})
        ]);

        // Create Users
        console.log('Creating users...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const client = await User.create({
            name: 'Alice Client',
            email: 'client@example.com',
            password: hashedPassword
        });

        const freelancers = await User.create([
            {
                name: 'Bob Freelancer',
                email: 'bob@example.com',
                password: hashedPassword
            },
            {
                name: 'Charlie Dev',
                email: 'charlie@example.com',
                password: hashedPassword
            }
        ]);

        console.log(`Created ${freelancers.length + 1} users.`);

        // Create Gigs
        console.log('Creating gigs...');
        const gigs = await Gig.create([
            {
                title: 'Modern Logo Design',
                description: 'We need a clean, modern logo for our tech startup. Think Airbnb meets Stripe. Minimalist, geometric, and scalable.',
                budget: 500,
                ownerId: client._id,
                status: 'open'
            },
            {
                title: 'React Dashboard Development',
                description: 'Looking for an expert to build a responsive admin dashboard using React, Tailwind CSS, and Recharts. Integration with existing REST API required.',
                budget: 1500,
                ownerId: client._id,
                status: 'open'
            },
            {
                title: 'SEO Content Writing',
                description: 'Need 5 high-quality blog posts about "The Future of Remote Work". Each post should be 1000+ words and SEO optimized.',
                budget: 300,
                ownerId: client._id,
                status: 'open'
            }
        ]);

        console.log(`Created ${gigs.length} gigs.`);

        // Create Bids
        console.log('Creating bids...');

        // Bob bids on Logo Design
        await Bid.create({
            gigId: gigs[0]._id,
            freelancerId: freelancers[0]._id,
            message: 'I specialize in minimalist logo design. Check my portfolio!',
            price: 450,
            status: 'pending'
        });

        // Charlie bids on Logo Design
        await Bid.create({
            gigId: gigs[0]._id,
            freelancerId: freelancers[1]._id,
            message: 'Experienced designer here. I can deliver 3 concepts in 24 hours.',
            price: 500,
            status: 'pending'
        });

        // Charlie bids on React Dashboard
        await Bid.create({
            gigId: gigs[1]._id,
            freelancerId: freelancers[1]._id,
            message: 'I have built similar dashboards before using the requested stack.',
            price: 1600,
            status: 'pending'
        });

        console.log('Created 3 bids.');

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seedData();
