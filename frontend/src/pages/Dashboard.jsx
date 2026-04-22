import { useState, useEffect } from 'react';
import { initialStudents } from '../services/studentService';
import StudentTable from '../components/StudentTable';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents(initialStudents);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <StudentTable students={students} onDelete={handleDelete} />
    </div>
  );
}
