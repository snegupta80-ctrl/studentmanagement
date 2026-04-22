import { Link } from 'react-router-dom';
import Button from './Button';

export default function StudentTable({ students, onDelete }) {
  return (
    <table className="w-full text-left mt-4 border-collapse">
      <thead>
        <tr className="bg-blue-500 text-white">
          <th className="p-4 rounded-tl">Name</th>
          <th className="p-4">Age</th>
          <th className="p-4">Course</th>
          <th className="p-4 rounded-tr">Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student._id} className="border-b">
            <td className="p-4">{student.name}</td>
            <td className="p-4">{student.age}</td>
            <td className="p-4">{student.course}</td>
            <td className="p-4 flex gap-2">
              <Link to={`/edit/${student._id}`} className="bg-yellow-500 text-white p-2 rounded inline-block text-center">
                Edit
              </Link>
              <Button onClick={() => onDelete(student._id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
