import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import assets from "../assets/assets";
import { FaBackward, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slices/ProfileSlice";
import { updateProfile } from "../Services/authServices";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log("image is  ",user?.profilePic);
  const [preview, setPreview] = useState(user?.profilePic || null);


   console.log("preview is  ",preview);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profilePic:user?.profilePic || null
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("profilePic", file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("bio", data.bio);
    if (data.profilePic) {
      formData.append("profilePic", data.profilePic);
    }
      
    try {
      const response = await updateProfile(token, formData);
      dispatch(setUser(response?.user));
      localStorage.setItem("user", JSON.stringify(response?.user));
    } catch (error) {
      console.log("Error in update profile:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Back Button */}

      
      <div
        className="absolute z-10 left-4 top-4 bg-gray-700 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-600 transition duration-300"
        onClick={() => navigate("/dashboard")}
      >
        <FaBackward />
      </div>

      <h2 className="text-3xl font-bold mb-2 text-center">Edit Profile</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-lg border border-gray-700"
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-3">
          <img
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-4 border-gray-700 shadow-md"
            src={preview || assets.avatar_icon}
            referrerpolicy="no-referrer" 
            alt="Profile Preview"
          />

          {!preview && (
            <label
              htmlFor="profilePic"
              className="mt-3 text-sm flex items-center gap-2 text-blue-400 cursor-pointer hover:text-blue-300"
            >
              <FaCloudUploadAlt size={20} /> Select Image
            </label>
          )}

          {preview && (
            <button
              type="button"
              className="mt-3 px-4 py-1 bg-gray-700 text-yellow-400 rounded-md hover:bg-gray-600 transition duration-200"
              onClick={() => {
                setPreview(null);
                setValue("profilePic", null);
              }}
            >
              Remove Image
            </button>
          )}

          <input
            id="profilePic"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("profilePic")}
            onChange={handleImageChange}
          />
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label className="block mb-1 text-cyan-500 font-medium">First Name</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 transition"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block mb-1 text-cyan-500 font-medium">Last Name</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 transition"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-cyan-500 mb-1 font-medium">
            Email{" "}
            <span className="text-red-400 text-xs">(cannot be changed)</span>
          </label>
          <input
            type="email"
            disabled
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 opacity-70 cursor-not-allowed"
            {...register("email")}
          />
        </div>

        {/* Bio */}
        <div className="mb-1">
          <label className="block mb-1 text-cyan-500 font-medium">Bio</label>
          <textarea
            rows="3"
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 resize-none focus:outline-none focus:border-blue-400 transition"
            {...register("bio")}
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg shadow-lg transition duration-300 font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
