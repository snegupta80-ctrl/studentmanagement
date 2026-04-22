import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? "text-purple-400 font-semibold" : "text-slate-300 hover:text-white transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/60 border-b border-slate-700/50 p-4 shadow-lg">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
            StudentMS
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className={isActive('/')}>Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              <div className="flex items-center gap-4 border-l border-slate-700/50 pl-6 ml-2">
                <span className="text-slate-400 text-sm">Hi, <span className="text-white font-medium">{user.name}</span></span>
                <button 
                  onClick={handleLogout}
                  className="text-slate-300 hover:text-red-400 transition-colors duration-200 cursor-pointer text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/signup" className={isActive('/signup')}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
