export default function Button({ onClick, children }) {
  return (
    <button 
      onClick={onClick} 
      className="bg-blue-500 text-white p-4 rounded"
    >
      {children}
    </button>
  );
}
