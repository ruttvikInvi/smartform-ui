import React, { useEffect } from "react";
import { WelcomeMessage } from "../components/WelcomMessage";
import { getAllForms } from "../services/formService";
import { FormCard } from "../components/FormCard";
import { useAuth } from "../context/authContext";

const DashboardPage: React.FC = () => {
  const [forms, setForms] = React.useState([]);
  const [error, setError] = React.useState<string | null>(null);
  const { userName } = useAuth();
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const response = await getAllForms();
        setForms(response);
      } catch (error) {
  const msg = (error as any)?.message || 'Failed to load forms. Please try again.';
  setError(msg);
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
  {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6 md:p-8 flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-500/10 flex-shrink-0">
                <FormInput className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-4xl font-extrabold text-gray-900 leading-none">
                  5
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Total Forms
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6 md:p-8 flex items-start gap-4">
              <div className="p-3 rounded-full bg-green-500/10 flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-4xl font-extrabold text-gray-900 leading-none">
                  10
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Total Fields
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6 md:p-8 flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-500/10 flex-shrink-0">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-4xl font-extrabold text-gray-900 leading-none">
                  20
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Avg Fields
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6 md:p-8 flex items-start gap-4">
              <div className="p-3 rounded-full bg-orange-500/10 flex-shrink-0">
                <FormInput className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-4xl font-extrabold text-gray-900 leading-none">
                  57
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Form Types
                </p>
              </div>
            </CardContent>
          </Card> */}

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
