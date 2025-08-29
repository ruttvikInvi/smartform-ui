import React, { useEffect } from "react";
import { WelcomeMessage } from "../components/WelcomMessage";
import { getAllForms } from "../services/formService";
import { FormCard } from "../components/FormCard";
import { useAuth } from "../context/authContext";

const DashboardPage: React.FC = () => {
  const [forms, setForms] = React.useState([]);
  const { userName } = useAuth();
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const response = await getAllForms();
        setForms(response);
      } catch (error) {
        console.error("Error fetching form fields:", error);
      }
    };
    fetchFormFields();
  }, []);
  return (
    <div className="">
      <WelcomeMessage
        userName={userName}
        onDismiss={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4">

          {forms && forms.length > 0 && forms?.map((form: any) => (
            <FormCard
              key={form.id}
              formName={form.title}
              formLink={form.publicId}
              createdAt={form.createdAt}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
