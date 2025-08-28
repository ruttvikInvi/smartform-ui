import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sparkles, FormInput, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <FormInput className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Create Forms with
            <span className="text-blue-600"> AI Magic</span>
          </h2>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your ideas into beautiful, functional forms instantly.
            Just describe what you need, and our AI will generate the perfect
            form for you.
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="px-8"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Creating
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>AI-Powered Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Describe your form in plain English and watch as AI creates
                exactly what you need
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FormInput className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Beautiful Design</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Every form is crafted with modern design principles and
                responsive layouts
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Instant Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                See your forms come to life instantly with real-time preview and
                editing
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
