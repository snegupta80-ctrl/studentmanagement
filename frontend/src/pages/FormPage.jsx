import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentById } from '../services/studentService';
import StudentForm from '../components/StudentForm';

export default function FormPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          const data = await getStudentById(id);
          setInitialData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id]);

  if (loading) return <div className="p-4 text-gray-500">Loading student details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Student' : 'Add Student'}</h2>
      <StudentForm initialData={initialData} />
    </div>
  );
}
