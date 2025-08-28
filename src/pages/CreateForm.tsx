import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  createForm,
  sendMessage,
  getFormDetails,
  submitFinalForm,
} from "../services/formService";
import { Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface FormFieldOption {
  id: string;
  label: string;
}

interface FormField {
  label: string;
  type: string;
  required: boolean;
  options?: FormFieldOption[] | string[];
}

interface ChatMessage {
  role: "user" | "agent";
  message: string;
}

const CreateFormPage: React.FC = () => {
  const [formId, setFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateForm = async (values: {
    formName: string;
    message: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createForm({
        formName: values.formName,
        message: values.message,
      });
      const newFormId = res.formPublicId;
      setFormId(newFormId);
      setFormName(res.formName);
      setFields(JSON.parse(res.llmResponse).fields || []);
      setUserMessages((prev) => [
        ...prev,
        { role: "user", message: values.message },
      ]);
    } catch (err: any) {
      const msg = err?.message || 'Failed to create form. Please try again.';
      setError(msg);
      console.error('Create form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!formId) return;
    setLoading(true);
    setUserMessages((prev) => [...prev, { role: "user", message }]);
    setError(null);
    try {
      const response = await sendMessage(formId, message);
      setFields(JSON.parse(JSON.parse(response.formJson).response).fields || []);
    //   await fetchFormDetails(formId);
    } catch (err: any) {
      const msg = err?.message || 'Failed to send message. Please try again.';
      setError(msg);
      console.error('Send message error:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (id: string) => {
    setLoading(true)
    setError(null);
    try {
      await submitFinalForm(id, JSON.stringify(fields));
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.message || 'Failed to publish form. Please try again.';
      setError(msg);
      console.error('Publish form error:', err);
    } finally {
      setLoading(false)
    }
  };

  const renderDynamicField = (field: FormField, index: number) => {
    const name = field.label.replace(/\s+/g, "_").toLowerCase();
    const baseInputClasses =
      "w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white";

    const labelClasses = "block text-sm font-medium mb-1 text-foreground";

    switch (field.type) {
      case "text":
      case "textarea":
        return (
          <div key={index}>
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Field type={field.type} name={name} className={baseInputClasses} />
          </div>
        );

      case "dropdown":
        return (
          <div key={index}>
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Field as="select" name={name} className={baseInputClasses}>
              <option value="">Select...</option>
              {field.options?.map((opt, idx) => {
                if (typeof opt === "string") {
                  return (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  );
                }
                return (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                );
              })}
            </Field>
          </div>
        );

      case "radio":
        return (
          <div key={index}>
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="space-y-1">
              {field.options?.map((opt, idx) => {
                const value = typeof opt === "string" ? opt : opt.id;
                const label = typeof opt === "string" ? opt : opt.label;

                return (
                  <label key={idx} className="flex items-center gap-2">
                    <Field
                      type="radio"
                      name={name}
                      value={value}
                      className="text-[rgb(var(--color-caribbean-current))]"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div key={index}>
            <label className={labelClasses}>
              {field.label}
            </label>

            <div className="space-y-1">
              {field.options?.map((opt, idx) => {
                const value = typeof opt === "string" ? opt : opt.id;
                const label = typeof opt === "string" ? opt : opt.label;

                return (
                  <label key={idx} className="flex items-center gap-2">
                    <Field
                      type="checkbox"
                      name={name}
                      value={value}
                      className="text-[rgb(var(--color-caribbean-current))]"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "datepicker":
        return (
          <div key={index}>
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Field type="date" name={name} className={baseInputClasses} />
          </div>
        );

      default:
        return null;
    }
  };

  const formPromptSuggestions = [
    "Create a simple contact form with name, email, and message.",
    "Build a job application form with personal details, work history.",
    "Make a feedback form with rating scale, comments, and improvement suggestions.",
    "Design an event registration form with attendee name, email, and ticket type selection.",
  ];

  return (
    <div className={`${!formId ? "w-full" : "w-xl"} mx-auto p-6`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {!formId ? (
            // Step 1: Create form
            <Formik
              initialValues={{ formName: "", message: "" }}
              validationSchema={Yup.object({
                formName: Yup.string().required("Form name required"),
                message: Yup.string().required("Message required"),
              })}
              onSubmit={handleCreateForm}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Form Name */}
                  <div>
                    <label
                      htmlFor="formName"
                      className="block text-sm font-medium mb-1 text-foreground"
                    >
                      Form Name
                    </label>
                    <Field
                      id="formName"
                      name="formName"
                      type="text"
                      disabled={loading}
                      placeholder="Enter form name"
                      className="w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
                    />
                    <ErrorMessage
                      name="formName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-1 text-foreground"
                    >
                      Prompt
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      disabled={loading}
                      placeholder="Describe the form you want to create"
                      rows={4}
                      className="w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white resize-none"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Suggestion Chips */}
                  {!formId && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <Sparkles className="h-4 w-4 text-blue-200" />
                      {formPromptSuggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFieldValue("message", suggestion)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex mx-auto w-[300px] py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-[rgb(var(--color-indigo-dye))] transition-colors font-semibold disabled:opacity-50"
                  >
                    {loading
                      ? formId
                        ? "Updating..."
                        : "Creating..."
                      : formId
                      ? "Update Form"
                      : "Generate Form"}
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="flex justify-between gap-32">
              <div className="flex-1">
                <div>
                  <label
                    htmlFor="formName"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Form Name
                  </label>
                  <input
                    id="message"
                    name="message"
                    type="text"
                    value={formName || ""}
                    disabled
                    className="w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
                  />
                </div>

                {/* Show only user messages so far */}
                <div className='mt-2'>
                  {userMessages.map((msg, idx) => (
                    <div key={idx} className="bg-gray-100 p-2 rounded my-1">
                      <strong>You:</strong> {msg.message}
                    </div>
                  ))}
                </div>

                {/* Send new message */}
                <Formik
                  initialValues={{ message: "" }}
                  validationSchema={Yup.object({
                    message: Yup.string().required("Message required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    handleSendMessage(values.message);
                    resetForm();
                  }}
                >
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="formName"
                        className="block text-sm font-medium mb-1 text-foreground"
                      >
                        Message
                      </label>
                      <Field
                        id="message"
                        name="message"
                        type="text"
                        className="w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
                      />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />

                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex mx-auto w-[300px] py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-[rgb(var(--color-indigo-dye))] transition-colors font-semibold disabled:opacity-50 mt-2"
                      >
                        Send
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </div>
              <div className="flex-1">
                {/* Dynamic form */}
                {fields.length > 0 && (
                  <Formik
                    initialValues={fields.reduce((acc, f) => {
                      acc[f.label.replace(/\s+/g, "_").toLowerCase()] = "";
                      return acc;
                    }, {} as Record<string, any>)}
                    onSubmit={() => submitForm(formId)}
                  >
                    <Form className="space-y-4">
                      {fields.map((f, idx) => renderDynamicField(f, idx))}
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex mx-auto w-[300px] py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-[rgb(var(--color-indigo-dye))] transition-colors font-semibold disabled:opacity-50 mt-2"
                      >
                        Publish Form
                      </Button>
                    </Form>
                  </Formik>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFormPage;
