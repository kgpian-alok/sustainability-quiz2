import React from "react";
import { Link } from "react-router-dom";
import { Frown } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center text-center">
      <div>
        <Frown className="mx-auto text-sky-400 mb-4" size={64} />
        <h1 className="text-6xl font-extrabold text-white">404</h1>
        <p className="text-2xl font-semibold mt-2 text-slate-300">
          Page Not Found
        </p>
        <p className="text-slate-400 mt-4 max-w-sm mx-auto">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
