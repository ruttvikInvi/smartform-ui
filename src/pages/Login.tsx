import React, { useEffect, useState } from "react";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeIcon, EyeOff, EyeOffIcon } from "lucide-react"; // you can swap icons if needed
import { loginUser } from "../services/authService";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { handleGoogleSignIn } from "../services/googleAuth";
import { Button } from "../components/ui/button";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    api?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center bg-background px-4 w-full">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
          onSubmit={async (values) => {
          setLoading(true);
          setErrors({});
          try {
            const res = await loginUser(values);
            login(res.token, res?.user?.name || "");
            navigate("/dashboard");
          } catch (err: any) {
            const msg = err?.message || err?.response?.data?.message || 'Login failed.';
            setErrors({ api: msg });
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-md bg-[rgb(var(--color-white))] dark:bg-[rgb(var(--color-jet))] rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-[rgb(var(--color-indigo-dye))] dark:text-[rgb(var(--color-platinum))]">
              Sign in to your account
            </h2>

            {errors.api && (
              <div className="text-red-500 text-sm mb-2">{errors.api}</div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none  bg-white"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full pr-9 px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
                />
                <button
                  type="button"
                  className="bg-transparent absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[rgb(var(--color-caribbean-current))] hover:underline"
              >
                Sign up
              </Link>
            </div>

            {/* Divider */}
            {/* <div className="flex items-center my-2">
              <div className="flex-grow border-t border-[rgb(var(--color-platinum))]" />
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-[rgb(var(--color-platinum))]" />
            </div>
            
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              disabled={loading}
            /> */}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
