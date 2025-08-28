import { postData, formatApiError } from './apiService';

// Define interfaces for request and response bodies if needed
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Function to handle user login
export const loginUser = async (userData: LoginRequest) => {
  try {
    const response = await postData('/Auth/login', userData);
    // Handle successful login response, e.g., store token, user info
    return response;
  } catch (error) {
  const formatted = formatApiError(error);
  console.error('Login failed:', formatted);
  throw formatted;
  }
};

// Function to handle user registration
export const registerUser = async (userData: RegisterRequest) => {
  try {
    const response = await postData('/Auth/register', userData);
    // Handle successful registration response
    return response;
  } catch (error) {
  const formatted = formatApiError(error);
  console.error('Registration failed:', formatted);
  throw formatted;
  }
};