import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSignupData } from "../slices/authSlice";
import { googleLoginSignup, SignUp } from "../Services/authServices";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { apiConnector } from "../utills/ApiConnector";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const SignUpPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const onSubmit = async (data) => {
      //  console.log("data in login page ", data)

        setLoading(true);
        const formData = new FormData();

        formData.append("email", data.email);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("password", data.password);
        formData.append("bio", data.bio);

        if (data.profilePic) {
            formData.append("profilePic", data.profilePic);
        }
        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ": ", pair[1]);
        // }

        //  dispatch(setSignupData(formData));
        try {
            const response = await SignUp(formData, navigate);
        } catch (error) {
          //  console.error("Signup error", error);
        }
        setLoading(false);
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];

    //     console.log("files", file)
    //     if (file) {
    //         setPreview(URL.createObjectURL(file));
    //      setValue("profilePic",file);
    //         setImage(file);
    //     }
    // };

    // const handleCancelImage = () => {

    //     setPreview(null);
    //     setValue("profilePic", null);
    // };


    // google login / signup

    const googleSignUpResponse = async (response) => {
        console.log("GOOGLE RESPONSE TO CLIENT ", response)
        setLoading(true);
        try {
            const res = await googleLoginSignup(response?.code, dispatch, navigate)
        } catch (error) {
            console.log("ERROR INTHE FRONTEND TO BACKEND API CALL IN GOOGLE LOGIN ", error)
        }
        setLoading(false);
    }
    const handleGoogleSignup = useGoogleLogin({
        onError: (Error) => console.log("ERROR IN GOOGLE RESPONSE TO THE FRONTEND ", Error),
        onSuccess: googleSignUpResponse,
        flow: 'auth-code',
    });
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 m-5 max-h-[1200px] p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-5"
            >
                {/* <div className="flex flex-col items-center">
            {preview ? (
                <img
                    src={preview}
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover shadow-md hover:scale-105 mb-2"
                />
            ) : (
                <div className="h-15 w-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-sm mb-2">
                    No Image
                </div>
            )}

            <div className="text-center">
                {!preview && (
                    <input
                        {...register("profilePic")}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
                    />
                )}
                {preview && (
                    <button
                        type="button"
                        onClick={handleCancelImage}
                        className="text-sm text-red-400 cursor-pointer underline hover:text-red-500 transition"
                    >
                        Remove Photo
                    </button>
                )}
            </div>
        </div> */}

                <h2 className="text-2xl font-extrabold text-center text-blue-400">
                    Create Your Account
                </h2>

                <div>
                    <input
                        {...register("firstName", { required: "First name is required" })}
                        placeholder="First Name"
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.firstName && (
                        <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register("lastName", { required: "Last name is required" })}
                        placeholder="Last Name"
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.lastName && (
                        <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register("email", { required: "Email is required" })}
                        placeholder="Email"
                        type="email"
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="relative">
                    <input
                        {...register("password", { required: "Password is required" })}
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        className="w-full  px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.password && (
                        <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
                    )}

                    <button
                        type="button"
                        className="absolute right-2 top-[0.8rem] cursor-pointer flex items-center text-gray-400 hover:text-gray-200"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div>
                    <textarea
                        {...register("bio")}
                        placeholder="Short Bio"
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition h-24 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold cursor-pointer rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <button
                    type="button"
                    disabled={loading}
                    className="w-full py-3 bg-gray-600 text-white font-semibold cursor-pointer rounded-lg hover:bg-gray-700 transition duration-300 shadow-md"
                    onClick={handleGoogleSignup}>Continue With Google</button>

                <div className="flex justify-end gap-2 text-gray-300">
                    <p>Already have an account?</p>
                    <Link to="/login" className="text-blue-400 underline hover:text-blue-300">
                        Go to login page
                    </Link>
                </div>
            </form>
        </div>

    );
};

export default SignUpPage;
