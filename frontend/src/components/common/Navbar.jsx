import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 h-[72px] border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="text-xl font-bold text-[#FF385C]">
        <Link to="/">GigFlow</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link 
          to="/login" 
          className="text-sm font-medium text-[#222222] px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          Log in
        </Link>
        <Link 
          to="/register" 
          className="text-sm font-medium text-[#222222] px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}
