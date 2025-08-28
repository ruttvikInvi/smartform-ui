import React from "react";

interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
  >
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <g>
        <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.09 30.13 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.61 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.99 37.13 46.1 31.36 46.1 24.55z"/>
        <path fill="#FBBC05" d="M10.67 28.09c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 16.09 0 19.91 0 24c0 4.09.99 7.91 2.69 11.44l7.98-6.2z"/>
        <path fill="#EA4335" d="M24 48c6.13 0 11.64-2.09 15.99-5.72l-7.19-5.59c-2.01 1.35-4.59 2.16-7.8 2.16-6.39 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </g>
    </svg>
    Sign in with Google
  </button>
);

export default GoogleSignInButton;
