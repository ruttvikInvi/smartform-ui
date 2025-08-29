import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../components/ui/button"; // Adjust the import based on your project structure
import { getFormDetails } from "../services/formService";
import { useNavigate, useParams } from "react-router-dom";
import { postData } from "../services/apiService";
import Loader from "../components/Loader";

interface FormFieldOption {
  id: string;
  label: string;
}

interface FormField {
  type: string;
  label: string;
  required: boolean;
  options?: FormFieldOption[] | string[];
}

const ViewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [formValues] = useState<{ [key: string]: any }>({});
  const handleSubmit = async (values: { [key: string]: any }) => {
    try {
      // Map original formFields to include `value`
      const fieldsWithValues = formFields.map((field) => {
        const name = field.label.replace(/\s+/g, "_").toLowerCase();
        return {
          ...field,
          value: values[name] ?? "", // add submitted value
        };
      });

      // Validate required fields
      const missingRequiredFields = fieldsWithValues.filter(
        (field) =>
          field.type !== "checkbox" &&
          field.required &&
          (!field.value || field.value.trim() === "")
      );

      if (missingRequiredFields.length > 0) {
        alert(
          `Please fill in all required fields:\n${missingRequiredFields
            .map((f) => f.label)
            .join(", ")}`
        );
        return; // Stop submission
      }

      const payload = {
        email: values["email"],
        formData: JSON.stringify(fieldsWithValues),
      };

      setLoading(true);
      await postData(`/Forms/public/${id}/submit`, payload);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDynamicField = (field: FormField, index: number) => {
    const name = field.label.replace(/\s+/g, "_").toLowerCase();
    const baseInputClasses =
      "w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white";

    const labelClasses = "block text-sm font-medium mb-1 text-foreground";

    const errorClasses = "text-red-500 text-xs mt-1";

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
            <ErrorMessage
              name={name}
              component="div"
              className={errorClasses}
            />
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
            <ErrorMessage
              name={name}
              component="div"
              className={errorClasses}
            />
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
            <ErrorMessage
              name={name}
              component="div"
              className={errorClasses}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={index}>
            <label className={labelClasses}>{field.label}</label>
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
            <ErrorMessage
              name={name}
              component="div"
              className={errorClasses}
            />
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
            <ErrorMessage
              name={name}
              component="div"
              className={errorClasses}
            />
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchFormFields = async () => {
      setLoading(true);
      try {
        const response = await getFormDetails(id);
        setFormFields(JSON.parse(response.finalJson));
      } catch (error) {
        console.error("Error fetching form fields:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormFields();
  }, [id]);

  return (
    <div className="flex justify-center mt-5">
      {loading ? (
        <Loader />
      ) : (
        <Formik
          initialValues={formValues}
          onSubmit={(values) => handleSubmit(values)}
        >
          <div className="max-w-3xl w-full">
            <Form className="space-y-6">
              {formFields.map((field: FormField, index) => (
                <div key={index}>{renderDynamicField(field, index)}</div>
              ))}
              <div className="flex justify-center items-center">
                <Button type="submit">
                Submit
              </Button>
              </div>
            </Form>
          </div>
        </Formik>
      )}
    </div>
  );
};

export default ViewForm;
