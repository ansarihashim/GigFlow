import { Router } from 'express';
import { getGigs, createGig } from '../controllers/gig.controller.js';
import { protect } from '../middleware/auth.middleware.js';

export const gigRouter = Router();

// GET /api/gigs (public)
gigRouter.get('/', getGigs);

// POST /api/gigs (protected)
gigRouter.post('/', protect, createGig);
