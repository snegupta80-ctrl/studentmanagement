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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <Link to="/add" className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 flex text-sm shadow-sm transition">
              + New Student
          </Link>
      </div>
      
      {students.length === 0 ? (
        <p>No students found. Try adding one!</p>
      ) : (
        <StudentTable students={students} onDelete={handleDelete} />
      )}
    </div>
  );
}
