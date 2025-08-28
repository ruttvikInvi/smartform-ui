import axios from 'axios';

const API_BASE_URL = 'https://fba266e1f869.ngrok-free.app/api'; // Replace with your actual API base URL

export const FRONTEND_URL = `http://localhost:${window.location.port}`

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "true"
  },
});

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses like 401
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, return it
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
      console.error('API Error Headers:', error.response.headers);

      // Example: Redirect to login if unauthorized
      if (error.response.status === 401) {
        // You might want to use your router's history object or a global state
        // to redirect the user to the login page.
        // For example, if you are using react-router-dom:
        // history.push('/login');
        // Or if you have a logout function in your context:
        // logout();
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

// --- Common API Methods ---

// Example: Fetch data
export const fetchData = async (url: string, params?: object) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Example: Post data
export const postData = async (url: string, data: object) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${url}:`, error);
    throw error;
  }
};

// Example: Put data
export const putData = async (url: string, data: object) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${url}:`, error);
    throw error;
  }
};

// Example: Delete data
export const deleteData = async (url: string) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${url}:`, error);
    throw error;
  }
};

// Send a POST request to the Chat API
export const sendChatMessage = async (formName: string, message: string) => {
  try {
    const response = await apiClient.post('/Chat', {
      formName,
      message,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'accept': 'application/json, text/plain, */*',
        'origin': 'http://localhost:5173',
        // ... other headers ...
      }
    });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export default apiClient;
