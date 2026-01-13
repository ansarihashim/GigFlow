import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGigById } from '../../services/gigs.api';
import { createBid } from '../../services/bids.api';
import { useAuth } from '../../store/AuthProvider';

export default function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bid State
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidError, setBidError] = useState(null);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const foundGig = await getGigById(id);
        if (foundGig) {
          setGig(foundGig);
        } else {
          setError("Gig not found");
        }
      } catch (err) {
        console.error("Failed to fetch gig details:", err);
        setError("Could not load gig details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setBidError(null);

    try {
      await createBid({
        gigId: id,
        price: Number(bidAmount),
        message: proposal
      });
      setBidSuccess(true);
      setBidAmount('');
      setProposal('');
    } catch (err) {
      console.error("Failed to place bid:", err);
      // Backend error message usually in err.message if apiFetch throws
      setBidError(err.message || "Failed to place bid. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#717171]">Loading gig details...</div>;
  }

  if (error || !gig) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">{error || "Gig not found"}</div>;
  }

  const isOwner = user && gig.ownerId === user._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Gig Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-semibold text-[#222222]">{gig.title}</h1>
              </div>

              <div className="flex items-center gap-4 text-lg font-medium text-[#222222] mt-2 mb-6">
                <span>Budget: ${gig.budget}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {gig.status.toUpperCase()}
                </span>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-medium text-[#222222] mb-3">Description</h3>
                <p className="text-[#717171] leading-relaxed whitespace-pre-line">
                  {gig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Bid Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-md p-6 border border-gray-100">

              {isOwner ? (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#222222] mb-4">Manage This Gig</h3>
                  <button
                    onClick={() => navigate(`/gigs/${id}/bids`)}
                    className="w-full bg-[#222222] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
                  >
                    View Bids
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-[#222222] mb-4">Place a Bid</h3>

                  {bidSuccess ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center mb-4 border border-green-200">
                      <p className="font-medium">Proposal sent successfully!</p>
                      <button
                        onClick={() => setBidSuccess(false)}
                        className="text-sm underline mt-2 hover:text-green-800"
                      >
                        Send another?
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                      {bidError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                          {bidError}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-[#717171] mb-1">Your Bid Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[#717171]">$</span>
                          <input
                            type="number"
                            required
                            min="1"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent transition-shadow"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#717171] mb-1">Proposal</label>
                        <textarea
                          rows="4"
                          required
                          value={proposal}
                          onChange={(e) => setProposal(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent transition-shadow resize-none"
                          placeholder="Describe why you're the best fit..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full bg-[#FF385C] text-white py-3 rounded-lg font-medium hover:bg-[#e03150] transition-colors shadow-sm ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {submitting ? 'Sending...' : 'Send Proposal'}
                      </button>

                      <p className="text-xs text-center text-[#717171] mt-2">
                        You will be able to edit your bid later.
                      </p>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
