import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { createStudent, updateStudent } from '../services/studentService';

export default function StudentForm({ initialData }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAge(initialData.age || '');
      setCourse(initialData.course || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !course) {
      alert('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      const data = { name, age: Number(age), course };
      if (initialData && initialData._id) {
        await updateStudent(initialData._id, data);
        window.alert('Student successfully updated!');
      } else {
        await createStudent(data);
        window.alert('Student successfully created!');
      }
      navigate('/dashboard');
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 max-w-md">
      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="border p-2 rounded w-full"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Age</label>
        <input 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          className="border p-2 rounded w-full"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Course</label>
        <input 
          type="text" 
          value={course} 
          onChange={(e) => setCourse(e.target.value)} 
          className="border p-2 rounded w-full"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Processing...' : (initialData ? 'Update Student' : 'Add Student')}
      </Button>
    </form>
  );
}
