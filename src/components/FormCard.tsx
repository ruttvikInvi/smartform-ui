import { Card, CardContent } from "../components/ui/card";
import { Link as LinkIcon, Copy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FRONTEND_URL } from "../services/apiService";

interface FormCardProps {
  formName: string;
  formLink: string;
  createdAt: string;
}

export function FormCard({ formName, formLink, createdAt }: FormCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${FRONTEND_URL}/view/form/${formLink}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <CardContent className="p-6 md:p-8 flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 rounded-full bg-blue-500/10 flex-shrink-0">
          <LinkIcon className="h-6 w-6 text-blue-600" />
        </div>

        {/* Form Details */}
        <div className="flex flex-col w-full">
          <p className="text-lg font-bold text-gray-900">{formName}</p>

          {/* Copy Link Row */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500 truncate">Copy Link</span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-gray-100 transition"
              title="Copy Link"
            >
              <Copy className="h-4 w-4 text-gray-100" />
            </button>
            {copied && (
              <span className="text-xs text-green-600 ml-1">Copied!</span>
            )}
          </div>

          {/* Date */}
          <p className="text-sm text-gray-500 mt-1">
            Created At: {new Date(createdAt).toLocaleDateString()}
          </p>
          <Button
            onClick={() => navigate(`/view/form/${formLink}/submissions`)}
          >
            View Submissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
