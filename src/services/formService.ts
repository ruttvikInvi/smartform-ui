import { fetchData, postData, putData } from "./apiService";

// Define interfaces for request and response bodies if needed
interface CreateFormRequest {
  formName: string;
  message: string;
}

// Function to create a new form
export const createForm = async (formData: CreateFormRequest) => {
  try {
    const response = await postData("/Chat", formData);
    // Handle successful form creation response

    console.log("response", response)
    return response;
  } catch (error) {
    console.error("Form creation failed:", error);
    throw error; // Re-throw to be caught by the component
  }
};

// Function to send a message to a specific form
export const sendMessage = async (formId: string, message: string) => {
  try {
    const response = await putData(`/Chat/form/public/${formId}`, { message });
    // Handle successful message sending response
    return response;
  } catch (error) {
    console.error("Sending message failed:", error);
    throw error; // Re-throw to be caught by the component
  }
};

// Function to submit the final form
export const submitFinalForm = async (formId: string, message: string) => {
  try {
    const response = await putData(`/Forms/${formId}/finaljson`, {
      finalJson: message,
    });
    // Handle successful final form submission response
    return response;
  } catch (error) {
    console.error("Final form submission failed:", error);
    throw error; // Re-throw to be caught by the component
  }
};

// Function to get form details
export const getFormDetails = async (formId: string) => {
  try {
    const response = await fetchData(`/Forms/public/${formId}/finaljson`);
    // Handle successful form details retrieval response
    return response;
  } catch (error) {
    console.error("Fetching form details failed:", error);
    throw error; // Re-throw to be caught by the component
  }
};

export const getFormSubmissions = async (formId: string) => {
  try {
    const response = await fetchData(`/Forms/${formId}/submissions`);
    // Handle successful form details retrieval response
    return response;
  } catch (error) {
    console.error("Fetching form details failed:", error);
    throw error; // Re-throw to be caught by the component
  }
};

// Function to get form details
export const getAllForms = async () => {
  try {
    const response = await fetchData(`/forms`);
    // Handle successful form details retrieval response
    return response;
  } catch (error) {
    console.error("Fetching form details failed:", error);
    throw error; // Re-throw to be caught by the component
  }
};