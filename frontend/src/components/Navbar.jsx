import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <h1 className="text-white text-xl font-bold">StudentMS</h1>
      <div className="mt-2">
        <Link to="/" className="text-white mr-4">Home</Link>
        <Link to="/dashboard" className="text-white">Dashboard</Link>
      </div>
    </nav>
  );
}
