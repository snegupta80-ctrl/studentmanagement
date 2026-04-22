import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-purple-400 font-semibold" : "text-slate-300 hover:text-white transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/60 border-b border-slate-700/50 p-4 shadow-lg">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
            StudentMS
        </h1>
        <div className="flex gap-6 items-center">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
