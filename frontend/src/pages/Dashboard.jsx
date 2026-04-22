import { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../services/studentService';
import StudentTable from '../components/StudentTable';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
            <p className="text-slate-400 text-sm mt-1">Manage your student directory</p>
          </div>
          <Link to="/add" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-lg px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Student
          </Link>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-1 shadow-xl">
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
