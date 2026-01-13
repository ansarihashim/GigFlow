import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGigs } from '../../services/gigs.api.js';

export default function GigList() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await getAllGigs();
        setGigs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch gigs:", err);
        setError("Could not load gigs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-start">
        <div className="text-[#717171]">Loading available gigs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-start">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-semibold text-[#222222] mb-8">Available Gigs</h1>

        {gigs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-[#717171]">
            No gigs available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100 flex flex-col h-full"
              >
                <div className="mb-4">
                  {/* Category placeholder or checking if it exists in API */}
                  {gig.category && (
                    <span className="inline-block bg-gray-100 text-[#717171] text-xs px-2 py-1 rounded-full mb-2">
                      {gig.category}
                    </span>
                  )}
                  <h3 className="text-lg font-medium text-[#222222] mb-2 line-clamp-2">
                    {gig.title}
                  </h3>
                  <p className="text-sm text-[#717171] mb-4 line-clamp-3">
                    {gig.description}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-[#222222]">${gig.budget}</span>
                  <Link
                    to={`/gigs/${gig._id}`}
                    className="text-[#FF385C] font-medium text-sm hover:text-[#e03150] transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
