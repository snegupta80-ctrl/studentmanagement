import { Link } from 'react-router-dom';
import Button from './Button';

export default function StudentTable({ students, onDelete }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-slate-800/80 text-slate-300 text-sm tracking-wider uppercase border-b border-slate-700/50 hidden sm:table-row">
            <th className="p-5 font-semibold">Student</th>
            <th className="p-5 font-semibold">Age</th>
            <th className="p-5 font-semibold">Course</th>
            <th className="p-5 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {students.map((student) => {
            const studentId = student._id || student.id;
            return (
            <tr key={studentId} className="hover:bg-slate-700/30 transition-colors group flex flex-col sm:table-row p-4 sm:p-0">
              <td className="p-2 sm:p-5">
                <span className="sm:hidden text-slate-400 text-xs uppercase tracking-wider block mb-1">Student</span>
                <div className="flex items-center gap-3">
                  {student.image ? (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm border-2 border-purple-500/30">
                      {student.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  <span className="hidden" />
                  <span className="font-medium text-white">{student.name}</span>
                </div>
              </td>
              <td className="p-2 sm:p-5 text-slate-300">
                <span className="sm:hidden text-slate-400 text-xs uppercase tracking-wider block mb-1">Age</span>
                {student.age}
              </td>
              <td className="p-2 sm:p-5">
                <span className="sm:hidden text-slate-400 text-xs uppercase tracking-wider block mb-1">Course</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {student.course}
                </span>
              </td>
              <td className="p-2 sm:p-5 sm:text-right">
                <div className="flex gap-3 sm:justify-end mt-2 sm:mt-0">
                  <Link to={`/edit/${studentId}`} className="flex-1 sm:flex-none justify-center items-center text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors shadow-sm cursor-pointer text-center">
                    Edit
                  </Link>
                  <button onClick={() => onDelete(studentId)} className="flex-1 sm:flex-none justify-center items-center text-sm px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20 cursor-pointer">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}
