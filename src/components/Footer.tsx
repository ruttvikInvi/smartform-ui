import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t mt-8 py-4 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        Created with
        <Heart className="inline mx-2 h-4 w-4 text-pink-500" aria-hidden="true" fill="red"/>
        <span className="sr-only">love</span>
        by Void Pirates
      </div>
    </footer>
  );
};

export default Footer;
