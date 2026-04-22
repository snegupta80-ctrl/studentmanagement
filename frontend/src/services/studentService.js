const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/students';

// Helper to handle standardized fetch errors and response parsing
const handleResponse = async (response) => {
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

export const getStudents = async () => {
    try {
        const response = await fetch(`${API_URL}?limit=100`); // getting all for dashboard logic
        const json = await handleResponse(response);
        return json.data; // backend returns { total, page, data: [...] }
    } catch (err) {
        console.error("Failed to fetch students", err);
        throw err;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};

export const createStudent = async (data) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
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
            method: 'DELETE'
        });
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};
