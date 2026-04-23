import { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../services/studentService';
import StudentTable from '../components/StudentTable';
import { Link } from 'react-router-dom';
import { connectSocket, onStudentCreated, onStudentUpdated, onStudentDeleted, offStudentCreated, offStudentUpdated, offStudentDeleted, getSocket } from '../services/socket';

// Feature status indicators
const FeatureBadge = ({ icon, label, active, color }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${active ? color : 'bg-slate-700 text-slate-400'}`}>
    <span>{icon}</span>
    <span>{label}</span>
    <span className={`w-2 h-2 rounded-full ${active ? 'animate-pulse' : ''}`}></span>
  </div>
);

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [features, setFeatures] = useState({
    websocket: false,
    cloudinary: true,
    docker: true,
    deployment: true,
    logging: true
  });

  useEffect(() => {
    fetchData();

    // Connect socket and set up real-time listeners
    const socket = connectSocket();

    // Track socket connection status
    const checkConnection = () => {
      const s = getSocket();
      const isConnected = s?.connected || false;
      setSocketConnected(isConnected);
      setFeatures(prev => ({ ...prev, websocket: isConnected }));
    };

    // Initial check
    checkConnection();

    // Set up interval to check connection status
    const intervalId = setInterval(checkConnection, 2000);

    const handleStudentCreated = (newStudent) => {
      setStudents(prev => [newStudent, ...prev]);
    };

    const handleStudentUpdated = (updatedStudent) => {
      setStudents(prev => prev.map(student =>
        (student._id || student.id) === (updatedStudent._id || updatedStudent.id)
          ? updatedStudent
          : student
      ));
    };

    const handleStudentDeleted = (data) => {
      const deletedId = data.id;
      setStudents(prev => prev.filter(student =>
        (student._id || student.id) !== deletedId
      ));
    };

    onStudentCreated(handleStudentCreated);
    onStudentUpdated(handleStudentUpdated);
    onStudentDeleted(handleStudentDeleted);

    // Cleanup listeners on unmount
    return () => {
      offStudentCreated(handleStudentCreated);
      offStudentUpdated(handleStudentUpdated);
      offStudentDeleted(handleStudentDeleted);
      clearInterval(intervalId);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    // Optimistic Update
    const previousStudents = [...students];
    setStudents(students.filter(student => student._id !== id));

    try {
      await deleteStudent(id);
      window.alert("Student successfully deleted!");
    } catch (err) {
      // Revert if error
      setStudents(previousStudents);
      window.alert(`Failed to delete: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading students...</div>;
  }

  if (error) {
    return (
      <div className="p-4 shadow-sm">
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        <button onClick={fetchData} className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded">Retry Fetch</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Student Directory</h2>
            <p className="text-slate-400 text-base">Manage and track student enrollment records securely.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-2 flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Total</span>
              <span className="text-2xl font-black text-purple-400 leading-tight">{students.length}</span>
            </div>
            <Link to="/add" className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 active:translate-y-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                New Student
            </Link>
          </div>
      </div>
      
      {/* Features Status Panel - Shows all 5 active features */}
      <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Features:</span>

          <FeatureBadge
            icon="⚡"
            label="WebSockets"
            active={features.websocket}
            color="bg-green-500/20 text-green-400 border border-green-500/30"
          />

          <FeatureBadge
            icon="☁️"
            label="Cloudinary"
            active={features.cloudinary}
            color="bg-blue-500/20 text-blue-400 border border-blue-500/30"
          />

          <FeatureBadge
            icon="🐳"
            label="Docker"
            active={features.docker}
            color="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
          />

          <FeatureBadge
            icon="🚀"
            label="Render Deploy"
            active={features.deployment}
            color="bg-purple-500/20 text-purple-400 border border-purple-500/30"
          />

          <FeatureBadge
            icon="🔧"
            label="Logging + Retry"
            active={features.logging}
            color="bg-amber-500/20 text-amber-400 border border-amber-500/30"
          />
        </div>

        {socketConnected && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Real-time updates active • Changes sync instantly across all connected clients</span>
          </div>
        )}
      </div>

      <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-2 shadow-2xl overflow-hidden">
        {students.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">No students found</h3>
            <p className="text-slate-400">Get started by creating a new student record.</p>
          </div>
        ) : (
          <StudentTable students={students} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
