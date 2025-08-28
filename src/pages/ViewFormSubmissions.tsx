import React, { useState, useEffect } from "react";
import { getFormSubmissions } from "../services/formService";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";

interface SubmittedField {
  label: string;
  type: string;
  required: boolean;
  value: string;
  options?: string[] | { id: string; label: string }[];
}

interface SubmissionResponse {
  id: number;
  email: string;
  submittedData: string;
  submittedAt: string;
}

const ViewForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchSubmissions = async () => {
      try {
        const response = await getFormSubmissions(id);
        setSubmissions(response || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, [id]);

  if (!submissions.length) {
    return (
      <>
        <Button variant="default" onClick={() => navigate(-1)}>
          Back
        </Button>
        <p className="text-center">No submissions found for this form.</p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="default" onClick={() => navigate(-1)}>
        Back
      </Button>
      <h2 className="text-2xl font-bold">Form Submissions</h2>

      {submissions.map((submission) => {
        const parsedData: SubmittedField[] = JSON.parse(
          submission.submittedData || "[]"
        );

        return (
          <div
            key={submission.id}
            className="border border-gray-300 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-gray-100 p-4">
              <p>
                <strong>Email:</strong> {submission.email}
              </p>
              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>

            <table className="min-w-full border-t border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-2 text-left">Label</th>
                  <th className="border p-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((field, index) => (
                  <tr key={index}>
                    <td className="border p-2">{field.label}</td>
                    <td className="border p-2">{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default ViewForm;
