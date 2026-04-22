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
    <div className="p-4 flex flex-col items-center pt-10">
      <div className="w-full max-w-lg mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {id ? 'Edit Student Record' : 'Enroll New Student'}
        </h2>
        <p className="text-slate-400 mt-2">
          {id ? 'Update the details of the student below.' : 'Fill out the form below to add a student to the database.'}
        </p>
      </div>
      <StudentForm initialData={initialData} />
    </div>
  );
}
