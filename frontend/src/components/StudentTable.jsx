import Button from './Button';

export default function StudentTable({ students, onDelete }) {
  return (
    <table className="w-full text-left mt-4">
      <thead>
        <tr className="bg-blue-500 text-white">
          <th className="p-4 rounded">Name</th>
          <th className="p-4 rounded">Age</th>
          <th className="p-4 rounded">Course</th>
          <th className="p-4 rounded">Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td className="p-4">{student.name}</td>
            <td className="p-4">{student.age}</td>
            <td className="p-4">{student.course}</td>
            <td className="p-4">
              <Button onClick={() => onDelete(student.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
