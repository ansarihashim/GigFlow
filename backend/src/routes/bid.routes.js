import { Router } from 'express';
import { createBid, getBidsByGig, hireBid } from '../controllers/bid.controller.js';
import { protect } from '../middleware/auth.middleware.js';

export const bidRouter = Router();

// POST /api/bids (protected)
bidRouter.post('/', protect, createBid);

// GET /api/bids/:gigId (protected, gig owner only)
bidRouter.get('/:gigId', protect, getBidsByGig);

// PATCH /api/bids/:bidId/hire (protected, gig owner only, transactional)
bidRouter.patch('/:bidId/hire', protect, hireBid);
