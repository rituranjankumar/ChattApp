// LoginPage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { googleLoginSignup, Login } from '../Services/authServices';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';

export const LoginPage = () => {
  const { socketConnected } = useSelector((state) => state.onLineUser)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    setLoading(true);
    console.log('Login data:', data);
    // TODO: integrate login logic or API call
    try {

      const response = await Login(data, navigate, dispatch)
    } catch (error) {
      console.log("error in login page ", error.message)

    }

    setLoading(false);
  };

      const googleSignUpResponse=async(response)=>
      {
          console.log("GOOGLE RESPONSE TO CLIENT ",response)
          setLoading(true);
          try{
              const res= await googleLoginSignup(response?.code,dispatch,navigate)
          }catch(error)
          {
              console.log("ERROR INTHE FRONTEND TO BACKEND API CALL IN GOOGLE LOGIN ",error)
          }
          setLoading(false);
      }
      const handleGoogleSignup=useGoogleLogin({
          onError:(Error)=>console.log("ERROR IN GOOGLE RESPONSE TO THE FRONTEND ",Error),
           onSuccess: googleSignUpResponse,
              flow: 'auth-code',
      });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Login to your account</h2>
          <p className="mt-2 text-sm text-gray-300">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 m-5 max-h-[1200px] p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-6"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`mt-1 w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-600'
                } bg-gray-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                })}
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-600'
                  } bg-gray-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
           
            <button
              disabled={loading}
              type="submit"
              className="w-full flex cursor-pointer justify-center items-center py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>

    

         
              <button
        disabled={loading}
        type="button" 
         className="w-full py-3 bg-gray-600 text-white font-semibold cursor-pointer rounded-lg hover:bg-gray-700 transition duration-300 shadow-md"
         onClick={handleGoogleSignup}>Continue With Google</button>
                   
        </form>

        

        {/* Footer */}
        <div className="text-sm text-center text-gray-300">
          Don’t have an account?{' '}
          <Link to="/" className="text-blue-400 font-medium hover:text-blue-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
