import { useParams } from 'react-router-dom';

export default function GigDetails() {
  const { id } = useParams();

  // Placeholder data - in a real app, fetch based on ID
  const gig = {
    title: "Logo Design for Startup",
    budget: "$200",
    description: `We are looking for a creative graphic designer to design a modern, minimalist logo for our new tech startup, 'Lumina'. 
    
    The logo should be clean, versatile, and work well on both dark and light backgrounds. We prefer geometric shapes and a sans-serif font.
    
    Deliverables:
    - Primary logo (vector AI/EPS + PNG)
    - Icon/mark variation
    - Brand color palette codes
    
    Timeline: 
    We need this completed within 5 days. Please attach your portfolio with your bid.`,
    client: "TechFlow Inc.",
    posted: "2 days ago"
  };

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

              <div className="text-lg font-medium text-[#222222] mt-2 mb-6">
                Budget: <span className="text-[#222222]">{gig.budget}</span>
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
              <h3 className="text-xl font-semibold text-[#222222] mb-4">Place a Bid</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#717171] mb-1">Your Bid Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[#717171]">$</span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent transition-shadow"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#717171] mb-1">Proposal</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent transition-shadow resize-none"
                    placeholder="Describe why you're the best fit..."
                  ></textarea>
                </div>

                <button className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-medium hover:bg-[#e03150] transition-colors shadow-sm">
                  Send Proposal
                </button>

                <p className="text-xs text-center text-[#717171] mt-2">
                  You will be able to edit your bid later.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
