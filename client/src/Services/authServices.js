import toast from "react-hot-toast";
import { apiConnector } from "../utills/ApiConnector";
import { MESSAGE_API, USER_API } from "./api";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/ProfileSlice";
import { setAllUsers, setOnlineUsers, setunseenMessage } from "../slices/onlineUserSlice";
import { connectSocket, disconnectSocket, getSocket } from "../socket";

export const SignUp = async (signupData, navigate) => {
  const toastId = toast.loading("Signing up...");
  try {
  //  console.log("sign up data", signupData);
    const response = await apiConnector("POST", USER_API.SIGNUP, signupData);


   // console.log("Signup response:", response);

    toast.success("Signup successful");

    // Navigate after success
    navigate("/login");
    return response;
  } catch (error) {
    toast.error(error.response.data.message, { id: toastId, duration: 5000 });
  //  console.error("Signup error:", error.response.data.message);

  }
  finally{
    toast.dismiss(toastId);
  }

};

export const Login = async (loginData, navigate, dispatch) => {
  const toastId = toast.loading("Logging in...");
  try {
   // console.log("login up data", loginData);
    const response = await apiConnector("POST", USER_API.LOGIN, loginData);

   // console.log("login response:", response);
    const { token, user } = response.data;

    toast.success("Login successful");
    dispatch(setToken(token));
    dispatch(setUser(user));
    localStorage.setItem("token", JSON.stringify(token))
    localStorage.setItem("user", JSON.stringify(user))

    const userId = user._id;
    //connect socket
    connectSocket(userId, dispatch);
    const socket = getSocket()
    socket.on("getOnlineUsers", (onlineUsers) => {
    //  console.log("online ", onlineUsers)
      dispatch(setOnlineUsers(onlineUsers));
    });
    // Navigate after success
    navigate("/dashboard");
    return response;
  } catch (error) {
    toast.error(`Login failed: ${error?.response?.data?.message || "Something went wrong"}`);
    //console.error("Login error:", error);
    return null;
  }
  finally {
    toast.dismiss(toastId);
  }
};


export const googleLoginSignup=async(code,dispatch,navigate)=>
{
  const toastId=toast.loading("logging in...");
  try{
    const res =await apiConnector("POST",USER_API.GOOGLELOGIN,{code});
    if(res.data.success)
    {
    //  console.log("response from backend after login " , res);
      toast.success("Login successful");
      dispatch(setToken(res?.data?.token))
          
     
    dispatch(setUser(res?.data?.user));
    localStorage.setItem("token", JSON.stringify(res?.data?.token))
    
    localStorage.setItem("user", JSON.stringify(res?.data?.user))

    const userId = res?.data?.user?._id;
    //connect socket
    connectSocket(userId, dispatch);


     // Navigate after success
    navigate("/dashboard");
    }
  }catch(error)
  {
   toast.error(`Google Login failed: ${error?.response?.data?.message}`);
   // console.log("GOOGLELOGINSIGNUP REPONSE ERROR ",error)
  }
  finally{
    toast.dismiss(toastId);
  }
}

export const getAllUsers = async (token) => {
  try {
    const response = await apiConnector('GET', MESSAGE_API.GET_USERS, null, {
      Authorization: `Bearer ${token}`,
    });


   // console.log("data from dashboard ", response)
    return response.data;

  } catch (error) {
   // console.error("Error fetching users:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};



export const updateProfile = async (token, formData) => {
  const toastId = toast.loading("Updating profile...");

  try {
    const res = await apiConnector(
      "PUT",
      USER_API.UPDATE_PROFILE,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    //console.log("RESPONSE OF UPDATE PROFILE", res);

    if (res?.data?.success) {
      toast.success("Profile updated");
    } else {
      toast.error(res?.data?.message || "Failed to update profile");
    }

    return res?.data;
  } catch (error) {
  //  console.log("ERROR IN UPDATE PROFILE", error);
    toast.error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  } finally {
    toast.dismiss(toastId);
  }
};
export const Logout = (dispatch, navigate) => {

  //  const socket = getSocket();
  // if (socket && socketConnected) {
  //   socket.disconnect(); //     disconnect
  //   socket.off(); // remove all listeners
  //   setSock; //   disconnects and resets the flag
  // }
  disconnectSocket(dispatch);
  dispatch(setToken(null));
  dispatch(setUser(null));
  dispatch(setAllUsers(null));
  dispatch(setunseenMessage(null));
  dispatch(setOnlineUsers([]))
  //   disconnectSocket();
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("allUsers")
  navigate("/")
}




