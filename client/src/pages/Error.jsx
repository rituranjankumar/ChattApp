import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Error = () => {
  const { token } = useSelector((state) => state.auth);  
  const navigate = useNavigate();

  return (
<div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
  <h1 className="text-6xl font-bold text-white">404</h1>
  <p className="text-2xl mt-4 text-white">Page Not Found</p>
  <p className="text-gray-200 mt-2">
    The page you're looking for doesn't exist.
  </p>

  {token ? (
    <button
      onClick={() => navigate("/dashboard")}
      className="mt-6 cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200"
    >
      Go to Dashboard
    </button>
  ) : (
    <Link
      to="/"
      className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
    >
      Go to Home
    </Link>
  )}
</div>

  );
};

export default Error;
