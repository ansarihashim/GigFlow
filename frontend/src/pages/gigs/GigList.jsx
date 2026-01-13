import { Link } from 'react-router-dom';

const PLACEHOLDER_GIGS = [
  {
    id: 1,
    title: "Logo Design for Startup",
    description: "Need a modern, minimalist logo for a tech startup.",
    budget: "$200",
    category: "Design"
  },
  {
    id: 2,
    title: "React Frontend Developer",
    description: "Build a responsive landing page using Tailwind CSS.",
    budget: "$500",
    category: "Development"
  },
  {
    id: 3,
    title: "Content Writer for Blog",
    description: "Write 5 SEO-optimized articles about digital marketing.",
    budget: "$150",
    category: "Writing"
  },
  {
    id: 4,
    title: "Social Media Manager",
    description: "Manage Instagram and LinkedIn accounts for 1 month.",
    budget: "$400",
    category: "Marketing"
  },
  {
    id: 5,
    title: "Video Editor for YouTube",
    description: "Edit high-quality 10-minute vlog with effects.",
    budget: "$300",
    category: "Video"
  },
  {
    id: 6,
    title: "Python Script for Automation",
    description: "Automate data scraping from 3 websites.",
    budget: "$250",
    category: "Development"
  }
];

export default function GigList() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-semibold text-[#222222] mb-8">Available Gigs</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLACEHOLDER_GIGS.map((gig) => (
            <div
              key={gig.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100 flex flex-col h-full"
            >
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-[#717171] text-xs px-2 py-1 rounded-full mb-2">
                  {gig.category}
                </span>
                <h3 className="text-lg font-medium text-[#222222] mb-2 line-clamp-2">
                  {gig.title}
                </h3>
                <p className="text-sm text-[#717171] mb-4 line-clamp-3">
                  {gig.description}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-[#222222]">{gig.budget}</span>
                <Link
                  to={`/gigs/${gig.id}`}
                  className="text-[#FF385C] font-medium text-sm hover:text-[#e03150] transition-colors"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
