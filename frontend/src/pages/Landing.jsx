import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Manage Students with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Elegance</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300">
          A premium, high-performance dashboard to track, organize, and manage your student database securely over MongoDB.
        </p>
      </div>
      
      <Link to="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-purple-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-500">
        Go to Dashboard
        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full mt-12 border-t border-slate-700/50">
        <FeatureCard title="Fast Integration" desc="Blazing fast React Vite frontend natively hooked to Express." />
        <FeatureCard title="Secure Storage" desc="All records are safely encrypted and preserved in MongoDB Atlas." />
        <FeatureCard title="Modern Aesthetics" desc="Built completely with Tailwind CSS utilizing dark-glass mode." />
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
