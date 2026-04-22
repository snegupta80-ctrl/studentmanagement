const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/students';

// Helper to handle standardized fetch errors and response parsing
const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
      else if (errorData.errors) errorMsg = errorData.errors.join(', ');
    } catch (e) {
      // Non-JSON response
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getStudents = async () => {
    try {
        const response = await fetch(`${API_URL}?limit=100`, {
            headers: getHeaders()
        });
        const json = await handleResponse(response);
        return json.data;
    } catch (err) {
        console.error("Failed to fetch students", err);
        throw err;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: getHeaders()
        });
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};

export const createStudent = async (data) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};

export const updateStudent = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};

export const deleteStudent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};
