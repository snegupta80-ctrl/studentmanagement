import { useState } from 'react';
import Button from './Button';

export default function StudentForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age || !course) {
      alert('Fields cannot be empty');
      return;
    }
    console.log({ name, age, course });
    setName('');
    setAge('');
    setCourse('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Age</label>
        <input 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Course</label>
        <input 
          type="text" 
          value={course} 
          onChange={(e) => setCourse(e.target.value)} 
          className="border p-2 rounded w-full"
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
