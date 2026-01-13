import mongoose from 'mongoose';
import { Bid } from '../models/Bid.model.js';
import { Gig } from '../models/Gig.model.js';
import { emitToUser } from '../socket/socketManager.js';

/**
 * @desc    Create a new bid on a gig
 * @route   POST /api/bids
 * @access  Private
 */
export async function createBid(req, res, next) {
  try {
    const { gigId, message, price } = req.body ?? {};

    if (!gigId || typeof gigId !== 'string') {
      return res.status(400).json({ success: false, error: 'gigId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({ success: false, error: 'Invalid gigId format' });
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ success: false, error: 'price must be a positive number' });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ success: false, error: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ success: false, error: 'Cannot bid on a gig that is not open' });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Cannot bid on your own gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message: message?.trim() ?? '',
      price,
      status: 'pending'
    });

    return res.status(201).json({ success: true, data: bid });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Get all bids for a specific gig (owner only)
 * @route   GET /api/bids/:gigId
 * @access  Private (gig owner only)
 */
export async function getBidsByGig(req, res, next) {
  try {
    const { gigId } = req.params;

    if (!gigId || !mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({ success: false, error: 'Invalid gigId format' });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ success: false, error: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gigId })
      .sort({ createdAt: -1 })
      .populate('freelancerId', 'name email');

    return res.json({ success: true, data: bids });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Hire a freelancer (accept a bid)
 * @route   PATCH /api/bids/:bidId/hire
 * @access  Private (gig owner only)
 * @note    Uses MongoDB transaction for atomicity and race-condition safety
 */
export async function hireBid(req, res, next) {
  const session = await mongoose.startSession();

  try {
    const { bidId } = req.params;

    if (!bidId || !mongoose.Types.ObjectId.isValid(bidId)) {
      session.endSession();
      return res.status(400).json({ success: false, error: 'Invalid bidId format' });
    }

    session.startTransaction();

    // Fetch bid within transaction
    const bid = await Bid.findById(bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, error: 'Bid not found' });
    }

    // Fetch gig within same transaction
    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, error: 'Gig not found' });
    }

    // Authorization: only gig owner can hire
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, error: 'Not authorized to hire for this gig' });
    }

    // Validation: gig must be open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: 'Gig is already assigned, cannot hire' });
    }

    // Atomic updates within transaction
    // 1) Update gig status to "assigned"
    await Gig.updateOne(
      { _id: gig._id },
      { $set: { status: 'assigned' } },
      { session }
    );

    // 2) Update selected bid status to "hired"
    await Bid.updateOne(
      { _id: bid._id },
      { $set: { status: 'hired' } },
      { session }
    );

    // 3) Reject all other pending bids for this gig
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id }, status: 'pending' },
      { $set: { status: 'rejected' } },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Fetch updated bid to return
    const updatedBid = await Bid.findById(bidId).populate('freelancerId', 'name email');

    // Emit real-time notification to hired freelancer (after transaction committed)
    const freelancerId = bid.freelancerId.toString();
    emitToUser(freelancerId, 'hired', {
      gigId: gig._id,
      gigTitle: gig.title,
      message: `You have been hired for ${gig.title}`
    });

    return res.json({
      success: true,
      message: 'Freelancer hired successfully',
      data: updatedBid
    });
  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
}
