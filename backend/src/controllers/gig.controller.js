import { Gig } from '../models/Gig.model.js';

/**
 * @desc    Get all open gigs (with optional search)
 * @route   GET /api/gigs
 * @access  Public
 */
export async function getGigs(req, res, next) {
  try {
    const { search } = req.query;

    const filter = { status: 'open' };

    if (search && typeof search === 'string' && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    const gigs = await Gig.find(filter)
      .sort({ createdAt: -1 })
      .populate('ownerId', 'name email');

    return res.json({ success: true, data: gigs });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Create a new gig
 * @route   POST /api/gigs
 * @access  Private
 */
export async function createGig(req, res, next) {
  try {
    const { title, description, budget } = req.body ?? {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, error: 'title is required' });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ success: false, error: 'description is required' });
    }

    if (budget === undefined || typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'budget must be a positive number' });
    }

    const gig = await Gig.create({
      title: title.trim(),
      description: description.trim(),
      budget,
      ownerId: req.user._id,
      status: 'open'
    });

    return res.status(201).json({ success: true, data: gig });
  } catch (error) {
    return next(error);
  }
}
