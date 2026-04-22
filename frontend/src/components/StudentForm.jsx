import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { createStudent, updateStudent } from '../services/studentService';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function StudentForm({ initialData }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAge(initialData.age || '');
      setCourse(initialData.course || '');
      setImageUrl(initialData.image || '');
      setImagePreview(initialData.image || '');
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Retry configuration
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 1000; // 1 second

  // Upload image to backend with retry logic
  const uploadImageWithRetry = async (file, retries = MAX_RETRIES, delay = INITIAL_DELAY) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      if (retries === 0) {
        throw error;
      }
      console.warn(`Upload failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return uploadImageWithRetry(file, retries - 1, delay * 2); // Exponential backoff
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !course) {
      alert('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      let uploadedImageUrl = imageUrl;
      
      // Upload image if a new file was selected (with retry logic)
      if (imageFile) {
        setUploadingImage(true);
        uploadedImageUrl = await uploadImageWithRetry(imageFile);
        setUploadingImage(false);
      }
      
      const data = { name, age: Number(age), course, image: uploadedImageUrl };
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
      setUploadingImage(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl max-w-lg mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Student Photo</label>
          <div className="flex flex-col items-center space-y-4">
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-purple-500/50"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{imagePreview ? 'Change Photo' : 'Upload Photo'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading || uploadingImage}
                />
              </label>
              {imagePreview && (
                <button 
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    setImageUrl('');
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                  disabled={loading || uploadingImage}
                >
                  Remove
                </button>
              )}
            </div>
            {uploadingImage && (
              <span className="text-sm text-purple-400 flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Uploading image...</span>
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="John Doe"
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="20"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Course</label>
            <input 
              type="text" 
              value={course} 
              onChange={(e) => setCourse(e.target.value)} 
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Computer Science"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/30 transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : (initialData ? 'Save Changes' : 'Create Student Record')}
          </button>
        </div>
      </form>
    </div>
  );
}
