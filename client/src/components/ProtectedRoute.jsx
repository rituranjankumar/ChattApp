import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = ({children}) => {
    const navigate=useNavigate();
      const {token}=useSelector((state)=>state.auth)
 
     useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Render children only if token exists
  if (!token) return null;

  return children;
}

export default ProtectedRoute