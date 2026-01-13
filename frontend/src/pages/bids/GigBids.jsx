import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGigById } from '../../services/gigs.api';
import { getBidsByGig, hireBid } from '../../services/bids.api';

export default function GigBids() {
  const { id } = useParams();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foundGig, foundBids] = await Promise.all([
          getGigById(id),
          getBidsByGig(id)
        ]);

        if (foundGig) {
          setGig(foundGig);
          setBids(foundBids || []);
        } else {
          setError("Gig not found");
        }
      } catch (err) {
        console.error("Failed to fetch bids/gig:", err);
        setError("Could not load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleHire = async (bidId) => {
    try {
      await hireBid(bidId);
      // Update local state to reflect change - set this bid to hired, others to rejected/pending or just reload
      // Backend transaction usually updates bid status to hired and gig status to assigned.
      // We'll update the specific bid status locally for instant feedback.
      setBids(prevBids => prevBids.map(bid => ({
        ...bid,
        status: bid._id === bidId ? 'hired' : bid.status
      })));

      // Also update gig status if needed
      if (gig) setGig({ ...gig, status: 'assigned' });

    } catch (err) {
      console.error("Failed to hire freelancer:", err);
      alert("Failed to hire. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading bids...</div>;
  if (error || !gig) return <div className="text-center py-10 text-red-500">{error || "Gig not found"}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">

        {/* Gig Summary Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-[#222222]">{gig.title}</h1>
            <p className="text-[#717171] mt-1">Budget: ${gig.budget}</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
            {gig.status.toUpperCase()}
          </span>
        </div>

        <h2 className="text-2xl font-semibold text-[#222222] mb-6">Manage Bids ({bids.length})</h2>

        {/* Bids List */}
        <div className="space-y-4">
          {bids.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-[#717171]">No bids have been placed yet.</p>
            </div>
          ) : (
            bids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Freelancer populated? If not, might need populate in backend or check structure */}
                      <h3 className="font-medium text-[#222222] text-lg">
                        {bid.freelancerId?.name || "Freelancer"}
                      </h3>
                      <span className="font-semibold text-[#222222]">${bid.price}</span>
                    </div>
                    <p className="text-[#717171] text-sm leading-relaxed whitespace-pre-line">
                      {bid.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 min-w-[120px] justify-end">
                    {bid.status === 'hired' ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Hired
                      </span>
                    ) : (
                      <button
                        onClick={() => handleHire(bid._id)}
                        disabled={gig.status !== 'open'}
                        className={`px-6 py-2 rounded-lg font-medium shadow-sm whitespace-nowrap transition-colors ${gig.status !== 'open'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#FF385C] text-white hover:bg-[#e03150]'
                          }`}
                      >
                        Hire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
