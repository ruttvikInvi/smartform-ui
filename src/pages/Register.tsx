import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeIcon, EyeOff, EyeOffIcon } from "lucide-react";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { handleGoogleSignIn } from "../services/googleAuth";

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    api?: string;
  }>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex items-center justify-center bg-background px-4 w-full">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          setLoading(true);
          setErrors({});
          try {
            const res = await registerUser(values);
            login(res.token, res?.user?.name || ""); // Store token & set isAuthenticated
            navigate("/dashboard"); // Redirect after registration
          } catch (err: any) {
            const msg = err?.message || err?.response?.data?.message || 'Registration failed.';
            setErrors({ api: msg });
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-md bg-[rgb(var(--color-white))] dark:bg-[rgb(var(--color-jet))] rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-[rgb(var(--color-indigo-dye))] dark:text-[rgb(var(--color-platinum))]">
              Create your account
            </h2>

            {errors.api && (
              <div className="text-red-500 text-sm mb-2">{errors.api}</div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                Name
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Email */}
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
                className="w-full px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Password */}
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
                  autoComplete="new-password"
                  className="w-full pr-9 px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
                />
                <button
                  type="button"
                  className="bg-transparent absolute inset-y-0 right-2 flex items-center hover:text-[rgb(var(--color-caribbean-current))] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full pr-9 px-3 py-2 border border-[rgb(var(--color-platinum))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-caribbean-current))] bg-white dark:bg-[rgb(var(--color-jet))] dark:text-white"
                />
                <button
                  type="button"
                  className="bg-transparent absolute inset-y-0 right-2 flex items-center hover:text-[rgb(var(--color-caribbean-current))] transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <ErrorMessage
                name="confirmPassword"
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
              {loading || isSubmitting ? "Registering..." : "Register"}
            </button>

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

            {/* Login Link */}
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[rgb(var(--color-caribbean-current))] hover:underline"
              >
                Sign in
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterPage;
