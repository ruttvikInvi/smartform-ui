import { fetchData, postData, putData, formatApiError } from "./apiService";

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
  const formatted = formatApiError(error);
  console.error("Form creation failed:", formatted);
  throw formatted;
  }
};

// Function to send a message to a specific form
export const sendMessage = async (formId: string, message: string) => {
  try {
    const response = await putData(`/Chat/form/public/${formId}`, { message });
    // Handle successful message sending response
    return response;
  } catch (error) {
  const formatted = formatApiError(error);
  console.error("Sending message failed:", formatted);
  throw formatted;
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
  const formatted = formatApiError(error);
  console.error("Final form submission failed:", formatted);
  throw formatted;
  }
};

// Function to get form details
export const getFormDetails = async (formId: string) => {
  try {
    const response = await fetchData(`/Forms/public/${formId}/finaljson`);
    // Handle successful form details retrieval response
    return response;
  } catch (error) {
  const formatted = formatApiError(error);
  console.error("Fetching form details failed:", formatted);
  throw formatted;
  }
};

export const getFormSubmissions = async (formId: string) => {
  try {
    const response = await fetchData(`/Forms/${formId}/submissions`);
    // Handle successful form details retrieval response
    return response;
  } catch (error) {
  const formatted = formatApiError(error);
  console.error("Fetching form details failed:", formatted);
  throw formatted;
  }
};

// Function to get form details
export const getAllForms = async () => {
  try {
    const response = await fetchData(`/forms`);
    // Handle successful form details retrieval response
    return response;
  } catch (error) {
  const formatted = formatApiError(error);
  console.error("Fetching form details failed:", formatted);
  throw formatted;
  }
};